#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char keta[8];

int coord_index[10];

int material_num;
char* material_f;
float* material_col;

int vertex_top;
int vertex_num;
int strip_num;

int group_cnt;
int group_num;

int coord_num;
float* coord;
float* normal;
float* color;
float* map;

int face_cnt;
int face_num;
int tri_num;
int v_num;
short* face;
int last_index;
int last_vertex;
int next_reverse;

char* progName(char* argv0) {
	char* szTop;
	char* szTmp;
	szTop = argv0;
	if ( (szTmp = strrchr(szTop, '\\')) != NULL ) {
		szTop = szTmp + 1;
	}
	if ( (szTmp = strrchr(szTop, '.')) != NULL ) {
		*szTmp = '\0';
	}
	return strlwr(szTop);
}

float x_0, y_0, z_0;
float x_1, y_1, z_1;
float x_2, y_2, z_2;
float cross_x, cross_y, cross_z;
float normal_x, normal_y, normal_z;
void cross(float x1, float y1, float z1, float x2, float y2, float z2) {
	cross_x = y1 * z2 - z1 * y2;
	cross_y = z1 * x2 - x1 * z2;
	cross_z = x1 * y2 - y1 * x2;
}
void normalize(float x, float y, float z) {
	float d = sqrt(x * x + y * y + z * z);
	if ( d != 0.0f ) {
		normal_x = x / d;
		normal_y = y / d;
		normal_z = z / d;
	} else {
		normal_x = 0.0f;
		normal_y = 0.0f;
		normal_z = 0.0f;
	}
}

void string(char** buf, char* str) {
	char* top;
	char* end;

	top = *buf;
	while ( (*top == ' ') || (*top == '\t') || (*top == '\r') || (*top == '\n') || (*top == '"') ) {
		top++;
	}

	end = top;
	while ( *end != '"' ) {
		end++;
	}

	memcpy(str, top, end - top);
	str[end - top] = '\0';

	*buf = end + 1;
}

void word(char** buf, char* str) {
	char* top;
	char* end;

	top = *buf;
	while ( (*top == ' ') || (*top == '\t') || (*top == '\r') || (*top == '\n') ) {
		top++;
	}

	end = top;
	while ( (*end != ' ') && (*end != ')') && (*end != '\t') && (*end != '\r') && (*end != '\n') ) {
		end++;
	}

	memcpy(str, top, end - top);
	str[end - top] = '\0';

	*buf = end + 1;
}

char find(char** buf, char* str) {
	char* cur;
	int len;

	len = strlen(str);
	cur = *buf;
	if ( (cur = strstr(cur, str)) != NULL ) {
		cur += len;
		*buf = cur;
		return 1;
	}
	return 0;
}

char find_line(char** buf, char* str) {
	char* cur;
	int len;

	len = strlen(str);
	cur = *buf;
	for ( ; ; ) {
		if ( strncmp(cur, str, len) == 0 ) {
			cur += len;
			*buf = cur;
			return 1;
		}
		cur++;
		if ( *cur == '\r' ) {
			*buf = cur;
			return 0;
		}
		if ( *cur == '\n' ) {
			*buf = cur;
			return 0;
		}
	}
	return 0;
}
void skip_line(char** buf) {
	char* cur;
	cur = *buf;
	for ( ; ; ) {
		if ( *cur == '\n' ) {
			cur++;
			*buf = cur;
			return;
		}
		cur++;
	}
}

char line[1024];
void get_line(char** buf) {
	char* cur;
	int tmp;

	tmp = 0;
	cur = *buf;
	for ( ; ; ) {
		if ( *cur == '\r' ) {
			cur++;
			*buf = cur;
			break;
		}
		if ( *cur == '\n' ) {
			*buf = cur;
			break;
		}
		line[tmp] = *cur;
		tmp++;
		cur++;
	}

	line[tmp    ] = '\r';
	line[tmp + 1] = '\n';
	line[tmp + 2] = '\0';
	skip_line(buf);
}

int string_f;
char* f(char* var, double scale) {
	int i, j;
	double v;
	char tmp[32];
	v = atof(var);
	v *= scale;
	sprintf(tmp, keta, v);
	j = -1;
	for ( i = 0; ; i++ ) {
		if ( tmp[i] == '\0' ) {
			break;
		} else if ( tmp[i] == '.' ) {
			j = i;
		} else {
			if ( j >= 0 ) {
				if ( tmp[i] != '0' ) {
					j = i + 1;
				}
			}
		}
	}
	if ( j >= 0 ) {
		tmp[j] = '\0';
	}
	strcpy(var, tmp);
	if ( string_f == 1 ) {
		if ( (var[0] == '-') && (var[1] == '0') ) {
			var[1] = '-';
			if ( var[2] == '\0' ) {
				return &var[2];
			} else {
				return &var[1];
			}
		} else if ( var[0] == '0' ) {
			return &var[1];
		}
	} else {
		if ( (var[0] == '-') && (var[1] == '0') && (var[2] == '\0') ) {
			return &var[1];
		}
	}
	return var;
}
void print(int val) {
	if ( (string_f == 1) && (val == 0) ) {
	} else {
		printf("%d", val);
	}
}
void print_fc(int val) {
	if ( (string_f == 1) && (val == 0) ) {
		printf(",");
	} else {
		printf(",%d", val);
	}
}
void print_bc(int val) {
	if ( (string_f == 1) && (val == 0) ) {
		printf(",");
	} else {
		printf("%d,", val);
	}
}

int main(int argc, char* argv[]) {
	int i, j, k;

	int cnt;

	double scale;

	FILE* texture_fp;
	FILE* in;

	char* buf;
	int in_size;

	char tmp[1024];
	int tmp_size;

	char* cur;
	char* cur2;

	char tmp1[16];
	char tmp2[16];
	char tmp3[16];
	char tmp4[16];
	char tmp_texture[128];
	char tmp_texture2[128];

	int col;

	int enter_f;
//	int string_f;
	int offset;

	enter_f = 0;
	string_f = 0;
	offset = 0;
	if ( argc > 1 ) {
		if ( stricmp(argv[1], "-e") == 0 ) {
			enter_f = 1;
			offset = 1;
		}
		if ( stricmp(argv[1], "-s") == 0 ) {
			string_f = 1;
			offset = 1;
		}
	}

	if ( argc < 6 + offset ) {
		printf("usage: %s [-e | -s] <mqo_file> <keta> <scale> <texture_file_list> <max_face_num>\n", progName(argv[0]));
		return 0;
	}

	sprintf(keta, "%%.%df", atoi(argv[2 + offset]));
	scale = atof(argv[3 + offset]);

	if ( (in = fopen(argv[1 + offset], "rb")) != NULL ) {
		in_size = 0;
		while ( fread(tmp, 1, 1024, in) != 0 ) {
			in_size += 1024;
		}
		fclose(in);

		buf = (char*)malloc(in_size + 1);

		in = fopen(argv[1 + offset], "rb");
		in_size = 0;
		while ( (tmp_size = fread(&buf[in_size], 1, 1024, in)) != 0 ) {
			in_size += tmp_size;
		}
		buf[in_size] = '\0';
		fclose(in);

if ( string_f == 1 ) {
	printf("\"");
}

		// Material
		cur = buf;
		if ( find(&cur, "Material ") ) {
			word(&cur, tmp);
			material_num = atoi(tmp);
print_bc(material_num); if ( enter_f == 1 ) { printf("\n"); }

			material_f = (char*)malloc(sizeof(char) * material_num);
			material_col = (float*)malloc(sizeof(float) * material_num * 3);

			skip_line(&cur);
			for ( i = 0; i < material_num; i++ ) {
				get_line(&cur);

				material_f[i] = 1;
				cur2 = line;
				if ( find_line(&cur2, "tex(") ) {
					string(&cur2, tmp);
//					for ( j = 0; j < strlen(tmp); j++ ) {
//						if ( tmp[j] == '.' ) {
//							tmp[j] = '\0';
//							break;
//						}
//					}
					if ( tmp[0] == '\\' ) {
						sprintf(tmp_texture2, "%s", &tmp[1]);
					} else {
						sprintf(tmp_texture2, "%s", tmp);
					}
					cnt = 0;
					if ( (texture_fp = fopen(argv[4 + offset], "rt")) != NULL ) {
						while ( fgets(tmp_texture, 127, texture_fp) != NULL ) {
							if ( strstr(tmp_texture, tmp_texture2) != NULL ) {
print(cnt);
cnt = -1;
								break;
							}
							cnt++;
						}
						fclose(texture_fp);
					}
					if ( cnt >= 0 ) {
						if ( tmp[0] == '\\' ) {
printf("%s", &tmp[1]);
						} else {
printf("%s", tmp);
						}
					}
				} else {
printf("-1");
					material_f[i] = 0;
				}
printf(",");
				cur2 = line;
				if ( find_line(&cur2, "dif(") ) {	// 拡散光 0～1
					word(&cur2, tmp);
					printf("%s", f(tmp, scale));
				}
printf(",");
				cur2 = line;
				if ( find_line(&cur2, "amb(") ) {	// 周囲光 0～1
					word(&cur2, tmp);
					printf("%s", f(tmp, scale));
				}
printf(",");
				cur2 = line;
				if ( find_line(&cur2, "emi(") ) {	// 自己照明 0～1
					word(&cur2, tmp);
					printf("%s", f(tmp, scale));
				}
printf(",");
				cur2 = line;
				if ( find_line(&cur2, "spc(") ) {	// 反射光 0～1
					word(&cur2, tmp);
					printf("%s", f(tmp, scale));
				}
printf(",");
				cur2 = line;
				if ( find_line(&cur2, "power(") ) {	// 反射光の強さ 0～100
					word(&cur2, tmp);
					printf("%s", f(tmp, scale));
				}
printf(","); if ( enter_f == 1 ) { printf("\n"); }

				cur2 = line;
				if ( find_line(&cur2, " col(") ) {
					for ( j = 0; j < 3; j++ ) {
						word(&cur2, tmp);
						material_col[i * 3 + j] = atof(tmp);
					}
				}
			}
		}

if ( string_f == 1 ) {
	printf(",,,");
	printf(",,,,");
} else {
	printf("0,0,0,"); if ( enter_f == 1 ) { printf("\n"); }
	printf("0,0,0,0,"); if ( enter_f == 1 ) { printf("\n"); }
}

		group_num = 0;
		coord_num = 0;
		cur = buf;
		while ( find(&cur, "vertex ") ) {
			word(&cur, tmp);
			vertex_num = atoi(tmp);
			if ( vertex_num > 0 ) {
				coord_num += vertex_num;
				group_num++;
			}
		}

		coord = (float*)malloc(sizeof(float) * coord_num * 3);
		normal = (float*)malloc(sizeof(float) * coord_num * 3);
		color = (float*)malloc(sizeof(float) * coord_num * 3);
		map = (float*)malloc(sizeof(float) * coord_num * 2);
		for ( i = 0; i < coord_num * 3; i++ ) {
			normal[i] = 0.0f;
			color[i] = 1.0f;
		}

		j = 0;
		cur = buf;
		while ( find(&cur, "vertex ") ) {
			word(&cur, tmp);
			vertex_num = atoi(tmp);
			skip_line(&cur);
			for ( i = 0; i < vertex_num; i++ ) {
				word(&cur, tmp); coord[j] = atof(tmp); j++;
				word(&cur, tmp); coord[j] = atof(tmp); j++;
				word(&cur, tmp); coord[j] = atof(tmp); j++;
			}
		}

		face_cnt = 0;
		cur = buf;
		while ( find(&cur, "face ") ) {
			word(&cur, tmp);
			cnt = atoi(tmp);
			if ( cnt > 0 ) {
				face_cnt += cnt;
			}
		}
		face = (short*)malloc(sizeof(short) * face_cnt * 7);
		for ( i = 0; i < face_cnt * 7; i++ ) {
			face[i] = -1;
		}

		group_cnt = 0;
		vertex_top = 0;
		face_cnt = 0;
		cur = buf;
		while ( find(&cur, "vertex ") ) {
			word(&cur, tmp);
			vertex_num = atoi(tmp);
			if ( vertex_num > 0 ) {
				find(&cur, "face ");
				word(&cur, tmp);
				face_num = atoi(tmp);
				skip_line(&cur);
				for ( i = 0; i < face_num; i++ ) {
					get_line(&cur);

					cur2 = line;

					word(&cur2, tmp);
					v_num = atoi(tmp);
					face[face_cnt * 7] = group_cnt;
					face[face_cnt * 7 + 2] = v_num;
					for ( j = 0; j < v_num; j++ ) {
						word(&cur2, tmp);
						if ( tmp[0] == 'V' ) {
							face[face_cnt * 7 + 3 + j] = atoi(&tmp[2]);
							coord_index[j] = vertex_top + atoi(&tmp[2]);
						} else {
							face[face_cnt * 7 + 3 + j] = atoi(tmp);
							coord_index[j] = vertex_top + atoi(tmp);
						}
					}

					x_0 = coord[coord_index[0] * 3    ];
					y_0 = coord[coord_index[0] * 3 + 1];
					z_0 = coord[coord_index[0] * 3 + 2];
					x_1 = coord[coord_index[1] * 3    ];
					y_1 = coord[coord_index[1] * 3 + 1];
					z_1 = coord[coord_index[1] * 3 + 2];
					x_2 = coord[coord_index[2] * 3    ];
					y_2 = coord[coord_index[2] * 3 + 1];
					z_2 = coord[coord_index[2] * 3 + 2];
					cross(x_1 - x_0, y_1 - y_0, z_1 - z_0, x_2 - x_0, y_2 - y_0, z_2 - z_0);
					normalize(cross_x, cross_y, cross_z);
					for ( j = 0; j < v_num; j++ ) {
						normal[coord_index[j] * 3    ] -= normal_x;
						normal[coord_index[j] * 3 + 1] -= normal_y;
						normal[coord_index[j] * 3 + 2] -= normal_z;
					}

					face[face_cnt * 7 + 1] = -1;

					if ( strstr(cur2, "UV(") != NULL ) {
						for ( j = 0; j < v_num; j++ ) {
							for ( k = 0; k < 2; k++ ) {
								word(&cur2, tmp);
								if ( tmp[0] == 'M' ) {
									face[face_cnt * 7 + 1] = atoi(&tmp[2]);
									word(&cur2, tmp);
								}
								if ( tmp[0] == 'U' ) {
									map[coord_index[j] * 2 + k] = atof(&tmp[3]);
								} else {
									map[coord_index[j] * 2 + k] = atof(tmp);
								}
							}
						}
					} else {
						for ( j = 0; j < v_num; j++ ) {
							for ( k = 0; k < 2; k++ ) {
								word(&cur2, tmp);
								if ( tmp[0] == 'M' ) {
									face[face_cnt * 7 + 1] = atoi(&tmp[2]);
								}
								map[coord_index[j] * 2 + k] = atof("0.0");
							}
						}
					}

					if ( face[face_cnt * 7 + 1] >= 0 ) {
						for ( j = 0; j < v_num; j++ ) {
							if ( material_f[face[face_cnt * 7 + 1]] == 0 ) {
								color[coord_index[j] * 3    ] = material_col[face[face_cnt * 7 + 1] * 3    ];
								color[coord_index[j] * 3 + 1] = material_col[face[face_cnt * 7 + 1] * 3 + 1];
								color[coord_index[j] * 3 + 2] = material_col[face[face_cnt * 7 + 1] * 3 + 2];
							}
						}
					}

					if ( find(&cur2, "COL(") ) {
						for ( j = 0; j < v_num; j++ ) {
							word(&cur2, tmp);
							col = atoi(tmp);
							color[coord_index[j] * 3    ] = (float) (col & 0x0000ff)        / 255.0f;
							color[coord_index[j] * 3 + 1] = (float)((col & 0x00ff00) >>  8) / 255.0f;
							color[coord_index[j] * 3 + 2] = (float)((col & 0xff0000) >> 16) / 255.0f;
						}
					}

					face_cnt++;
				}
				vertex_top += vertex_num;
				group_cnt++;
			}
		}

		// coord
print_bc(group_num); if ( enter_f == 1 ) { printf("\n"); }
		vertex_top = 0;
		cur = buf;
		while ( find(&cur, "vertex ") ) {
			word(&cur, tmp);
			vertex_num = atoi(tmp);
			if ( vertex_num > 0 ) {
				print_bc(vertex_num); if ( enter_f == 1 ) { printf("\n"); }
				for ( i = 0; i < vertex_num; i++ ) {
					sprintf(tmp1, "%f", coord[vertex_top * 3 + i * 3    ]);
					sprintf(tmp2, "%f", coord[vertex_top * 3 + i * 3 + 1]);
					sprintf(tmp3, "%f", coord[vertex_top * 3 + i * 3 + 2]);
					printf("%s,%s,%s,", f(tmp1, scale), f(tmp2, scale), f(tmp3, scale)); if ( enter_f == 1 ) { printf("\n"); }
				}
				vertex_top += vertex_num;
			}
		}

		// normal
print_bc(group_num); if ( enter_f == 1 ) { printf("\n"); }
		vertex_top = 0;
		cur = buf;
		while ( find(&cur, "vertex ") ) {
			word(&cur, tmp);
			vertex_num = atoi(tmp);
			if ( vertex_num > 0 ) {
				print_bc(vertex_num); if ( enter_f == 1 ) { printf("\n"); }
				for ( i = 0; i < vertex_num; i++ ) {
					normalize(
						normal[vertex_top * 3 + i * 3    ],
						normal[vertex_top * 3 + i * 3 + 1],
						normal[vertex_top * 3 + i * 3 + 2]
						);
					sprintf(tmp1, "%f", normal_x);
					sprintf(tmp2, "%f", normal_y);
					sprintf(tmp3, "%f", normal_z);
					printf("%s,%s,%s,", f(tmp1, scale), f(tmp2, scale), f(tmp3, scale)); if ( enter_f == 1 ) { printf("\n"); }
				}
				vertex_top += vertex_num;
			}
		}

		// color
print_bc(group_num); if ( enter_f == 1 ) { printf("\n"); }
		vertex_top = 0;
		cur = buf;
		while ( find(&cur, "vertex ") ) {
//		while ( find(&cur, "color ") ) {
//			word(&cur, tmp1);
//			word(&cur, tmp2);
//			word(&cur, tmp3);
//			find(&cur, "vertex ");
			word(&cur, tmp);
			vertex_num = atoi(tmp);
			if ( vertex_num > 0 ) {
				print_bc(vertex_num); if ( enter_f == 1 ) { printf("\n"); }
				for ( i = 0; i < vertex_num; i++ ) {
//					if ( color[vertex_top * 3 + i * 3] >= 0.0f ) {
						sprintf(tmp1, "%f", color[vertex_top * 3 + i * 3    ]);
						sprintf(tmp2, "%f", color[vertex_top * 3 + i * 3 + 1]);
						sprintf(tmp3, "%f", color[vertex_top * 3 + i * 3 + 2]);
						printf("%s,%s,%s,", f(tmp1, scale), f(tmp2, scale), f(tmp3, scale)); if ( enter_f == 1 ) { printf("\n"); }
//					} else {
//						printf("%s,%s,%s,", tmp1, tmp2, tmp3); if ( enter_f == 1 ) { printf("\n"); }
//					}
				}
				vertex_top += vertex_num;
			}
		}

		// map
print_bc(group_num); if ( enter_f == 1 ) { printf("\n"); }
		vertex_top = 0;
		cur = buf;
		while ( find(&cur, "vertex ") ) {
			word(&cur, tmp);
			vertex_num = atoi(tmp);
			if ( vertex_num > 0 ) {
				print_bc(vertex_num); if ( enter_f == 1 ) { printf("\n"); }
				for ( i = 0; i < vertex_num; i++ ) {
					sprintf(tmp1, "%f", map[vertex_top * 2 + i * 2    ]);
					sprintf(tmp2, "%f", map[vertex_top * 2 + i * 2 + 1]);
					printf("%s,%s,", f(tmp1, 1.0f), f(tmp2, 1.0f)); if ( enter_f == 1 ) { printf("\n"); }
				}
				vertex_top += vertex_num;
			}
		}

		if ( face_cnt > atoi(argv[5 + offset]) ) {
			face_cnt = atoi(argv[5 + offset]);
		}

		tri_num = 0;
		strip_num = 0;
		for ( i = 0; i < group_num; i++ ) {
			for ( j = -1; j < material_num; j++ ) {
				cnt = 0;
				for ( k = 0; k < face_cnt; k++ ) {
					if ( (face[k * 7] == i) && (face[k * 7 + 1] == j) ) {
						cnt += face[k * 7 + 2];
					}
				}
				if ( cnt > 0 ) {
					strip_num++;
				}
			}
		}
		print_bc(strip_num); if ( enter_f == 1 ) { printf("\n"); }
		i = 0;
		cur = buf;
		while ( find(&cur, "Object ") ) {
			find(&cur, "rotation ");
			word(&cur, tmp1);
			find(&cur, "translation ");
			word(&cur, tmp2);
			word(&cur, tmp3);
			word(&cur, tmp4);
			for ( j = -1; j < material_num; j++ ) {
				cnt = 0;
				last_index = -1;
				for ( k = 0; k < face_cnt; k++ ) {
					if ( (face[k * 7] == i) && (face[k * 7 + 1] == j) ) {
						if ( last_index >= 0 ) {
							cnt += 2;
						}
						last_index = 0;
						cnt += face[k * 7 + 2];
					}
				}
				if ( cnt > 0 ) {
#if 0
					printf("%s,%s,%s,", tmp2, tmp3, tmp4); if ( enter_f == 1 ) { printf("\n"); }
					printf("%s,0,1,0,", tmp1); if ( enter_f == 1 ) { printf("\n"); }
#else
if ( string_f == 1 ) {
					printf(",,,");
					printf(",,,,");
} else {
					printf("0,0,0,"); if ( enter_f == 1 ) { printf("\n"); }
					printf("0,0,0,0,"); if ( enter_f == 1 ) { printf("\n"); }
}
#endif
					print_bc(j); if ( enter_f == 1 ) { printf("\n"); }
if ( string_f == 1 ) {
	if ( i == 0 ) {
					printf(",,,,");
	} else {
					printf("%d,%d,%d,%d,", i, i, i, i);
	}
} else {
					printf("%d,%d,%d,%d,", i, i, i, i); if ( enter_f == 1 ) { printf("\n"); }
}
					print(cnt);
					last_index = -1;
					last_vertex = -1;
					next_reverse = 0;
					for ( k = 0; k < face_cnt; k++ ) {
						if ( (face[k * 7] == i) && (face[k * 7 + 1] == j) ) {
							if ( last_index >= 0 ) {
								// インデックスを2個追加
								print_fc(last_index);
								print_fc(face[k * 7 + 3]);
							}
							if ( face[k * 7 + 2] == 4 ) {
								if ( (last_vertex == 4) && (next_reverse == 1) ) {
									// 前回が反転させた四角形の場合、反転させる
									last_index = face[k * 7 + 3];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 1];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 3];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 2];
									print_fc(last_index);
									next_reverse = 1;
								} else if ( (last_vertex == 3) && (next_reverse == 1) ) {
									// 前回が反転でない三角形の場合、反転させる
									last_index = face[k * 7 + 3];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 1];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 3];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 2];
									print_fc(last_index);
									next_reverse = 1;
								} else {
									last_index = face[k * 7 + 3];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 3];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 1];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 2];
									print_fc(last_index);
									next_reverse = 0;
								}
								tri_num += 2;
								last_vertex = 4;
							} else {
								if ( (last_vertex == 4) && (next_reverse == 1) ) {
									// 前回が反転させた四角形の場合、反転させる
									last_index = face[k * 7 + 3];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 1];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 2];
									print_fc(last_index);
									next_reverse = 0;
								} else if ( (last_vertex == 3) && (next_reverse == 1) ) {
									// 前回が反転でない三角形の場合、反転させる
									last_index = face[k * 7 + 3];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 1];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 2];
									print_fc(last_index);
									next_reverse = 0;
								} else {
									last_index = face[k * 7 + 3];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 2];
									print_fc(last_index);
									last_index = face[k * 7 + 3 + 1];
									print_fc(last_index);
									next_reverse = 1;
								}
								tri_num++;
								last_vertex = 3;
							}
						}
					}
					printf(","); if ( enter_f == 1 ) { printf("\n"); }
				}
			}
			i++;
		}

if ( string_f == 1 ) {
		printf("%d\",\n", tri_num);
} else {
		printf("%d,\n", tri_num);
}

		free(material_f);
		free(material_col);

		free(coord);
		free(normal);
		free(color);
		free(map);

		free(face);

		free(buf);
	}

	return 0;
}

/*
■三角形・四角形リストから三角形ストリップを作成するメモ

①反転でない三角形から、三角形または四角形に繋げる場合

A B C  /  D E F
 ↓        ↓反転させる
A B C c d D F E
A B C c d D F E G

【結果】

A B C / C B c / C c d / c d D / d D F / F D E
        ~~~~~   ~~~~~   ~~~~~   ~~~~~    ↓同じ
                 縮退三角形             D E F

②反転させた三角形から、三角形または四角形に繋げる場合（①の続き）

D E F  /  G H I
 ↓反転    ↓
D F E e g G H I
D F E e g G H I J

【結果】

F D E / F E e / e E g / e g G / G g H / G H I
        ~~~~~   ~~~~~   ~~~~~   ~~~~~
                 縮退三角形

③反転させた四角形から、四角形または三角形に繋げる場合（①の続き）

D E F G  /  H I J K
  ↓反転      ↓反転させる
D F E G g h H J I K
D F E G g h H J I

【結果】

F D E / F E G / G E g / G g h / h g H / h H J / J H I
                ~~~~~   ~~~~~   ~~~~~   ~~~~~    ↓同じ
                         縮退三角形             H I J

④反転でない四角形から、四角形または三角形に繋げる場合

A B C D  /  E F G H
  ↓          ↓
A B C D d e E F G H
A B C D d e E F G

【結果】

A B C / C B D / C D d / d D e / d e E / E e F / E F G
                ~~~~~   ~~~~~   ~~~~~   ~~~~~
                         縮退三角形
*/
