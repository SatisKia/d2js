#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char keta[8];

// グローバル
double* g_coord = NULL;
int g_coord_size = 0;
double* g_color = NULL;
int g_color_size = 0;
double* g_map = NULL;
int g_map_size = 0;
double* g_normal = NULL;
int g_normal_size = 0;

// オブジェクト
typedef struct {
	double* coord;
	int coord_size;
	double* color;
	int color_size;
	double* map;
	int map_size;
	double* normal;
	int normal_size;

	int* coord_index;
	int coord_index_size;
	int* map_index;
	int map_index_size;
	int* normal_index;
	int normal_index_size;

	char* material_name;
	double material_diffuse;
	double material_ambient;
	double material_emission;
	double material_spcular;
	double material_shininess;
} object_t;
object_t** object;
int object_num;
void new_object(object_t** data) {
	*data = (object_t*)malloc(sizeof(object_t));

	(*data)->coord = NULL;
	(*data)->coord_size = 0;
	(*data)->color = NULL;
	(*data)->color_size = 0;
	(*data)->map = NULL;
	(*data)->map_size = 0;
	(*data)->normal = NULL;
	(*data)->normal_size = 0;

	(*data)->coord_index = NULL;
	(*data)->coord_index_size = 0;
	(*data)->map_index = NULL;
	(*data)->map_index_size = 0;
	(*data)->normal_index = NULL;
	(*data)->normal_index_size = 0;

	(*data)->material_name = NULL;
	(*data)->material_diffuse = 0.0f;
	(*data)->material_ambient = 0.0f;
	(*data)->material_emission = 0.0f;
	(*data)->material_spcular = 0.0f;
	(*data)->material_shininess = 0.0f;
}
void free_object(object_t** data) {
	if ( (*data)->coord != NULL ) {
		free((*data)->coord);
	}
	if ( (*data)->color != NULL ) {
		free((*data)->color);
	}
	if ( (*data)->map != NULL ) {
		free((*data)->map);
	}
	if ( (*data)->normal != NULL ) {
		free((*data)->normal);
	}

	if ( (*data)->coord_index != NULL ) {
		free((*data)->coord_index);
	}
	if ( (*data)->map_index != NULL ) {
		free((*data)->map_index);
	}
	if ( (*data)->normal_index != NULL ) {
		free((*data)->normal_index);
	}

	if ( (*data)->material_name != NULL ) {
		free((*data)->material_name);
	}

	free(*data);
}

void add_object() {
	object_num++;
	if ( object_num == 1 ) {
		object = (object_t**)malloc(sizeof(object_t*) * object_num);
	} else {
		object = (object_t**)realloc(object, sizeof(object_t*) * object_num);
	}
	new_object(&object[object_num - 1]);
}
void add_coord(char* data) {
	if ( object_num == 0 ) {
		g_coord_size++;
		if ( g_coord_size == 1 ) {
			g_coord = (double*)malloc(sizeof(double) * g_coord_size);
		} else {
			g_coord = (double*)realloc(g_coord, sizeof(double) * g_coord_size);
		}
		g_coord[g_coord_size - 1] = atof(data);
	} else {
		object[object_num - 1]->coord_size++;
		if ( object[object_num - 1]->coord_size == 1 ) {
			object[object_num - 1]->coord = (double*)malloc(sizeof(double) * object[object_num - 1]->coord_size);
		} else {
			object[object_num - 1]->coord = (double*)realloc(object[object_num - 1]->coord, sizeof(double) * object[object_num - 1]->coord_size);
		}
		object[object_num - 1]->coord[object[object_num - 1]->coord_size - 1] = atof(data);
	}
}
void add_color(char* data) {
	if ( object_num == 0 ) {
		g_color_size++;
		if ( g_color_size == 1 ) {
			g_color = (double*)malloc(sizeof(double) * g_color_size);
		} else {
			g_color = (double*)realloc(g_color, sizeof(double) * g_color_size);
		}
		g_color[g_color_size - 1] = atof(data);
	} else {
		object[object_num - 1]->color_size++;
		if ( object[object_num - 1]->color_size == 1 ) {
			object[object_num - 1]->color = (double*)malloc(sizeof(double) * object[object_num - 1]->color_size);
		} else {
			object[object_num - 1]->color = (double*)realloc(object[object_num - 1]->color, sizeof(double) * object[object_num - 1]->color_size);
		}
		object[object_num - 1]->color[object[object_num - 1]->color_size - 1] = atof(data);
	}
}
void add_map(char* data) {
	if ( object_num == 0 ) {
		g_map_size++;
		if ( g_map_size == 1 ) {
			g_map = (double*)malloc(sizeof(double) * g_map_size);
		} else {
			g_map = (double*)realloc(g_map, sizeof(double) * g_map_size);
		}
		g_map[g_map_size - 1] = atof(data);
	} else {
		object[object_num - 1]->map_size++;
		if ( object[object_num - 1]->map_size == 1 ) {
			object[object_num - 1]->map = (double*)malloc(sizeof(double) * object[object_num - 1]->map_size);
		} else {
			object[object_num - 1]->map = (double*)realloc(object[object_num - 1]->map, sizeof(double) * object[object_num - 1]->map_size);
		}
		object[object_num - 1]->map[object[object_num - 1]->map_size - 1] = atof(data);
	}
}
void add_normal(char* data) {
	if ( object_num == 0 ) {
		g_normal_size++;
		if ( g_normal_size == 1 ) {
			g_normal = (double*)malloc(sizeof(double) * g_normal_size);
		} else {
			g_normal = (double*)realloc(g_normal, sizeof(double) * g_normal_size);
		}
		g_normal[g_normal_size - 1] = atof(data);
	} else {
		object[object_num - 1]->normal_size++;
		if ( object[object_num - 1]->normal_size == 1 ) {
			object[object_num - 1]->normal = (double*)malloc(sizeof(double) * object[object_num - 1]->normal_size);
		} else {
			object[object_num - 1]->normal = (double*)realloc(object[object_num - 1]->normal, sizeof(double) * object[object_num - 1]->normal_size);
		}
		object[object_num - 1]->normal[object[object_num - 1]->normal_size - 1] = atof(data);
	}
}
void add_coord_index(char* data, int separator) {
	object[object_num - 1]->coord_index_size++;
	if ( object[object_num - 1]->coord_index_size == 1 ) {
		object[object_num - 1]->coord_index = (int*)malloc(sizeof(int) * object[object_num - 1]->coord_index_size);
	} else {
		object[object_num - 1]->coord_index = (int*)realloc(object[object_num - 1]->coord_index, sizeof(int) * object[object_num - 1]->coord_index_size);
	}
	int index = atoi(data);
	object[object_num - 1]->coord_index[object[object_num - 1]->coord_index_size - 1] = (separator == 1) ? -index : index;
}
void add_map_index(char* data) {
	object[object_num - 1]->map_index_size++;
	if ( object[object_num - 1]->map_index_size == 1 ) {
		object[object_num - 1]->map_index = (int*)malloc(sizeof(int) * object[object_num - 1]->map_index_size);
	} else {
		object[object_num - 1]->map_index = (int*)realloc(object[object_num - 1]->map_index, sizeof(int) * object[object_num - 1]->map_index_size);
	}
	object[object_num - 1]->map_index[object[object_num - 1]->map_index_size - 1] = atoi(data);
}
void add_normal_index(char* data) {
	object[object_num - 1]->normal_index_size++;
	if ( object[object_num - 1]->normal_index_size == 1 ) {
		object[object_num - 1]->normal_index = (int*)malloc(sizeof(int) * object[object_num - 1]->normal_index_size);
	} else {
		object[object_num - 1]->normal_index = (int*)realloc(object[object_num - 1]->normal_index, sizeof(int) * object[object_num - 1]->normal_index_size);
	}
	object[object_num - 1]->normal_index[object[object_num - 1]->normal_index_size - 1] = atoi(data);
}

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

double x_0, y_0, z_0;
double x_1, y_1, z_1;
double x_2, y_2, z_2;
double cross_x, cross_y, cross_z;
void cross(double x1, double y1, double z1, double x2, double y2, double z2) {
	cross_x = y1 * z2 - z1 * y2;
	cross_y = z1 * x2 - x1 * z2;
	cross_z = x1 * y2 - y1 * x2;
}
void normalize(double* x, double* y, double* z) {
	double normal_x, normal_y, normal_z;
	double d = sqrt(*x * *x + *y * *y + *z * *z);
	if ( d != 0.0f ) {
		normal_x = *x / d;
		normal_y = *y / d;
		normal_z = *z / d;
	} else {
		normal_x = 0.0f;
		normal_y = 0.0f;
		normal_z = 0.0f;
	}
	*x = normal_x;
	*y = normal_y;
	*z = normal_z;
}

char* fgets2(char* buf, int len, FILE* fp) {
	char* tmp = fgets(buf, len, fp);
	if ( tmp != NULL ) {
		/* 行末の改行コードを取り除く */
		char* szTmp = tmp;
		while ( (*szTmp != '\r') && (*szTmp != '\n') && (*szTmp != '\0') ) {
			szTmp++;
		}
		*szTmp = '\0';
	}
	return tmp;
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

int tri_num;
void make_strip(int* coord_index, int coord_index_size, int offset) {
	int i = 0;
	int last_index = -1;
	int last_vertex = -1;
	int next_reverse = 0;
	while ( i < coord_index_size ) {
		if ( last_index >= 0 ) {
			// インデックスを2個追加
			print_fc(last_index);
			print_fc(coord_index[i] - 1 - offset);
		}
		if ( coord_index[i + 2] < 0 ) {
			if ( (last_vertex == 4) && (next_reverse == 1) ) {
				// 前回が反転させた四角形の場合、反転させる
				last_index = face[i    ] - 1 - offset; print_fc(last_index);
				last_index = face[i + 2] - 1 - offset; print_fc(last_index);
				last_index = face[i + 1] - 1 - offset; print_fc(last_index);
				i += 3;
				next_reverse = 0;
			} else if ( (last_vertex == 3) && (next_reverse == 1) ) {
				// 前回が反転でない三角形の場合、反転させる
				last_index = face[i    ] - 1 - offset; print_fc(last_index);
				last_index = face[i + 2] - 1 - offset; print_fc(last_index);
				last_index = face[i + 1] - 1 - offset; print_fc(last_index);
				i += 3;
				next_reverse = 0;
			} else {
				last_index = face[i    ] - 1 - offset; print_fc(last_index);
				last_index = face[i + 1] - 1 - offset; print_fc(last_index);
				last_index = face[i + 2] - 1 - offset; print_fc(last_index);
				i += 3;
				next_reverse = 1;
			}
			tri_num++;
			last_vertex = 3;
		} else {
			if ( (last_vertex == 4) && (next_reverse == 1) ) {
				// 前回が反転させた四角形の場合、反転させる
				last_index = face[i    ] - 1 - offset; print_fc(last_index);
				last_index = face[i + 3] - 1 - offset; print_fc(last_index);
				last_index = face[i + 1] - 1 - offset; print_fc(last_index);
				last_index = face[i + 2] - 1 - offset; print_fc(last_index);
				i += 4;
				next_reverse = 1;
			} else if ( (last_vertex == 3) && (next_reverse == 1) ) {
				// 前回が反転でない三角形の場合、反転させる
				last_index = face[i    ] - 1 - offset; print_fc(last_index);
				last_index = face[i + 3] - 1 - offset; print_fc(last_index);
				last_index = face[i + 1] - 1 - offset; print_fc(last_index);
				last_index = face[i + 2] - 1 - offset; print_fc(last_index);
				i += 4;
				next_reverse = 1;
			} else {
				last_index = face[i    ] - 1 - offset; print_fc(last_index);
				last_index = face[i + 1] - 1 - offset; print_fc(last_index);
				last_index = face[i + 3] - 1 - offset; print_fc(last_index);
				last_index = face[i + 2] - 1 - offset; print_fc(last_index);
				i += 4;
				next_reverse = 0;
			}
			tri_num += 2;
			last_vertex = 4;
		}
	}
}

int main(int argc, char* argv[]) {
	int i, j;

	double scale;

	char material_file[256];
	FILE* material_fp;
	FILE* in;

	char line[256];

	char* top;
	char* end;
	char* cur;

	char tmp[64];

	int step;

	int index;
	int offset;

	int debug_f;
	int enter_f;
//	int string_f;
	int arg_offset;

	debug_f = 0;
	enter_f = 0;
	string_f = 0;
	arg_offset = 0;
	if ( argc > arg_offset + 1 ) {
		if ( strcmp(argv[arg_offset + 1], "-E") == 0 ) {
			debug_f = 1;
			enter_f = 1;
			arg_offset++;
		} else if ( stricmp(argv[arg_offset + 1], "-e") == 0 ) {
			enter_f = 1;
			arg_offset++;
		} else if ( stricmp(argv[arg_offset + 1], "-s") == 0 ) {
			string_f = 1;
			arg_offset++;
		}
	}

	if ( argc < 4 + arg_offset ) {
		printf("usage: %s [-E|-e|-s] <obj_file> <keta> <scale>\n", progName(argv[0]));
		return 0;
	}

	sprintf(keta, "%%.%df", atoi(argv[2 + arg_offset]));
	scale = atof(argv[3 + arg_offset]);

	object = NULL;
	object_num = 0;

	material_file[0] = '\0';
	if ( (in = fopen(argv[1 + arg_offset], "rt")) != NULL ) {
		while ( fgets2(line, 255, in) != NULL ) {
			if ( strncmp(line, "mtllib ", 7) == 0 ) {	// mtlファイル名
				strcpy(material_file, &line[7]);
			} else if ( strncmp(line, "o ", 2) == 0 ) {	// オブジェクト名
				add_object();
			} else if ( strncmp(line, "usemtl ", 7) == 0 ) {	// マテリアル名
				if ( object_num == 0 ) {
					add_object();
				}
				if ( object[object_num - 1]->material_name != NULL ) {
					add_object();
				}
				object[object_num - 1]->material_name = strdup(&line[7]);
				if ( (material_fp = fopen(material_file, "rt")) != NULL ) {
					step = 0;
					while ( fgets2(line, 255, material_fp) != NULL ) {
						if ( strncmp(line, "newmtl ", 7) == 0 ) {	// マテリアル名
							if ( strcmp(&line[7], object[object_num - 1]->material_name) == 0 ) {
								step = 1;
							} else {
								step = 0;
							}
						} else if ( step == 1 ) {
							if ( strncmp(line, "Kd ", 3) == 0 ) {	// material_diffuse
								top = &line[3];
								if ( (end = strchr(top, ' ')) != NULL ) {
									*end = '\0';
								}
								if ( object_num == 0 ) {
									add_object();
								}
								object[object_num - 1]->material_diffuse = atof(top);
							} else if ( strncmp(line, "Ka ", 3) == 0 ) {	// material_ambient
								top = &line[3];
								if ( (end = strchr(top, ' ')) != NULL ) {
									*end = '\0';
								}
								if ( object_num == 0 ) {
									add_object();
								}
								object[object_num - 1]->material_ambient = atof(top);
							} else if ( strncmp(line, "Ke ", 3) == 0 ) {	// material_emission
								top = &line[3];
								if ( (end = strchr(top, ' ')) != NULL ) {
									*end = '\0';
								}
								if ( object_num == 0 ) {
									add_object();
								}
								object[object_num - 1]->material_emission = atof(top);
							} else if ( strncmp(line, "Ks ", 3) == 0 ) {	// material_spcular
								top = &line[3];
								if ( (end = strchr(top, ' ')) != NULL ) {
									*end = '\0';
								}
								if ( object_num == 0 ) {
									add_object();
								}
								object[object_num - 1]->material_spcular = atof(top);
							} else if ( strncmp(line, "Ns ", 3) == 0 ) {	// material_shininess
								top = &line[3];
								if ( (end = strchr(top, ' ')) != NULL ) {
									*end = '\0';
								}
								if ( object_num == 0 ) {
									add_object();
								}
								object[object_num - 1]->material_shininess = atof(top);
							}
						}
					}
					fclose(material_fp);
				}
			} else if ( strncmp(line, "v ", 2) == 0 ) {	// 頂点座標・頂点カラー
				top = &line[2];
				step = 0;
				while ( (end = strchr(top, ' ')) != NULL ) {
					*end = '\0';
					switch ( step ) {
					case 0:
					case 1:
					case 2:
						add_coord(top);
						break;
					case 3:
					case 4:
					case 5:
						add_color(top);
						break;
					}
					top = end + 1;
					step++;
				}
				switch ( step ) {
				case 0:
				case 1:
				case 2:
					add_coord(top);
					break;
				case 3:
				case 4:
				case 5:
					add_color(top);
					break;
				}
			} else if ( strncmp(line, "vt ", 3) == 0 ) {	// テクスチャマップ
				top = &line[3];
				while ( (end = strchr(top, ' ')) != NULL ) {
					*end = '\0';
					add_map(top);
					top = end + 1;
				}
				add_map(top);
			} else if ( strncmp(line, "vn ", 3) == 0 ) {	// 法線
				top = &line[3];
				while ( (end = strchr(top, ' ')) != NULL ) {
					*end = '\0';
					add_normal(top);
					top = end + 1;
				}
				add_normal(top);
			} else if ( strncmp(line, "f ", 2) == 0 ) {	// 面（1オリジンのインデックス）
				if ( object_num == 0 ) {
					add_object();
				}
				top = &line[2];
				while ( (end = strchr(top, ' ')) != NULL ) {
					*end = '\0';
					if ( (cur = strchr(top, '/')) != NULL ) {
						*cur = '\0';
						add_coord_index(top, 0);
						top = cur + 1;
						if ( (cur = strchr(top, '/')) != NULL ) {
							*cur = '\0';
							if ( strlen(top) > 0 ) {
								add_map_index(top);
							}
							top = cur + 1;
							add_normal_index(top);
						} else {
							add_map_index(top);
						}
					} else {
						add_coord_index(top, 0);
					}
					top = end + 1;
				}
				if ( (cur = strchr(top, '/')) != NULL ) {
					*cur = '\0';
					add_coord_index(top, 1);
					top = cur + 1;
					if ( (cur = strchr(top, '/')) != NULL ) {
						*cur = '\0';
						if ( strlen(top) > 0 ) {
							add_map_index(top);
						}
						top = cur + 1;
						add_normal_index(top);
					} else {
						add_map_index(top);
					}
				} else {
					add_coord_index(top, 1);
				}
			}
		}
		fclose(in);
	}

if ( debug_f == 1 ) {
	printf("/*\n");
	printf("g_coord %d ", g_coord_size);
	for ( j = 0; j < g_coord_size; j++ ) {
		if ( j > 0 ) {
			printf(",");
		}
		printf("%f", g_coord[j]);
	}
	printf("\n");
	printf("g_color %d ", g_color_size);
	for ( j = 0; j < g_color_size; j++ ) {
		if ( j > 0 ) {
			printf(",");
		}
		printf("%f", g_color[j]);
	}
	printf("\n");
	printf("g_map %d ", g_map_size);
	for ( j = 0; j < g_map_size; j++ ) {
		if ( j > 0 ) {
			printf(",");
		}
		printf("%f", g_map[j]);
	}
	printf("\n");
	printf("g_normal %d ", g_normal_size);
	for ( j = 0; j < g_normal_size; j++ ) {
		if ( j > 0 ) {
			printf(",");
		}
		printf("%f", g_normal[j]);
	}
	printf("\n");
	for ( i = 0; i < object_num; i++ ) {
		printf("coord[%d] %d ", i, object[i]->coord_size);
		for ( j = 0; j < object[i]->coord_size; j++ ) {
			if ( j > 0 ) {
				printf(",");
			}
			printf("%f", object[i]->coord[j]);
		}
		printf("\n");
		printf("color[%d] %d ", i, object[i]->color_size);
		for ( j = 0; j < object[i]->color_size; j++ ) {
			if ( j > 0 ) {
				printf(",");
			}
			printf("%f", object[i]->color[j]);
		}
		printf("\n");
		printf("map[%d] %d ", i, object[i]->map_size);
		for ( j = 0; j < object[i]->map_size; j++ ) {
			if ( j > 0 ) {
				printf(",");
			}
			printf("%f", object[i]->map[j]);
		}
		printf("\n");
		printf("normal[%d] %d ", i, object[i]->normal_size);
		for ( j = 0; j < object[i]->normal_size; j++ ) {
			if ( j > 0 ) {
				printf(",");
			}
			printf("%f", object[i]->normal[j]);
		}
		printf("\n");
		printf("coord_index[%d] %d ", i, object[i]->coord_index_size);
		for ( j = 0; j < object[i]->coord_index_size; j++ ) {
			if ( j > 0 ) {
				printf(",");
			}
			printf("%d", object[i]->coord_index[j]);
		}
		printf("\n");
		printf("map_index[%d] %d ", i, object[i]->map_index_size);
		for ( j = 0; j < object[i]->map_index_size; j++ ) {
			if ( j > 0 ) {
				printf(",");
			}
			printf("%d", object[i]->map_index[j]);
		}
		printf("\n");
		printf("normal_index[%d] %d ", i, object[i]->normal_index_size);
		for ( j = 0; j < object[i]->normal_index_size; j++ ) {
			if ( j > 0 ) {
				printf(",");
			}
			printf("%d", object[i]->normal_index[j]);
		}
		printf("\n");
		printf("material_name[%d] %s\n", i, (object[i]->material_name == NULL) ? "NULL" : object[i]->material_name);
		printf("material_diffuse[%d] %f\n", i, object[i]->material_diffuse);
		printf("material_ambient[%d] %f\n", i, object[i]->material_ambient);
		printf("material_emission[%d] %f\n", i, object[i]->material_emission);
		printf("material_spcular[%d] %f\n", i, object[i]->material_spcular);
		printf("material_shininess[%d] %f\n", i, object[i]->material_shininess);
	}
	printf("*/\n");
}

if ( string_f == 1 ) {
	printf("\"");
}

	// マテリアル
	print_bc(object_num);
	if ( enter_f == 1 ) {
		printf("\n");
	}
	for ( i = 0; i < object_num; i++ ) {
		print_bc(-1);
		sprintf(tmp, "%f", object[i]->material_diffuse  ); printf("%s,", f(tmp, 1.0f));
		sprintf(tmp, "%f", object[i]->material_ambient  ); printf("%s,", f(tmp, 1.0f));
		sprintf(tmp, "%f", object[i]->material_emission ); printf("%s,", f(tmp, 1.0f));
		sprintf(tmp, "%f", object[i]->material_spcular  ); printf("%s,", f(tmp, 1.0f));
		sprintf(tmp, "%f", object[i]->material_shininess); printf("%s,", f(tmp, 1.0f));
		if ( enter_f == 1 ) {
			printf("\n");
		}
	}

	// モデルの平行移動
if ( string_f == 1 ) {
	printf(",,,");
} else {
	printf("0,0,0,");
	if ( enter_f == 1 ) {
		printf("\n");
	}
}

	// モデルの回転
if ( string_f == 1 ) {
	printf(",,,,");
} else {
	printf("0,0,0,0,");
	if ( enter_f == 1 ) {
		printf("\n");
	}
}

	// 頂点
	print_bc(object_num);
	if ( enter_f == 1 ) {
		printf("\n");
	}
	for ( i = 0; i < object_num; i++ ) {
		print_bc(object[i]->coord_size / 3);
		for ( j = 0; j < object[i]->coord_size / 3; j++ ) {
			sprintf(tmp, "%f", object[i]->coord[j * 3    ]); printf("%s,", f(tmp, 1.0f));
			sprintf(tmp, "%f", object[i]->coord[j * 3 + 1]); printf("%s,", f(tmp, 1.0f));
			sprintf(tmp, "%f", object[i]->coord[j * 3 + 2]); printf("%s,", f(tmp, 1.0f));
		}
		if ( enter_f == 1 ) {
			printf("\n");
		}
	}

	// 法線
	print_bc(object_num);
	if ( enter_f == 1 ) {
		printf("\n");
	}
	for ( i = 0; i < object_num; i++ ) {
		print_bc(object[i]->normal_size / 3);
		for ( j = 0; j < object[i]->normal_size / 3; j++ ) {
			sprintf(tmp, "%f", object[i]->normal[j * 3    ]); printf("%s,", f(tmp, 1.0f));
			sprintf(tmp, "%f", object[i]->normal[j * 3 + 1]); printf("%s,", f(tmp, 1.0f));
			sprintf(tmp, "%f", object[i]->normal[j * 3 + 2]); printf("%s,", f(tmp, 1.0f));
		}
		if ( enter_f == 1 ) {
			printf("\n");
		}
	}

	// 頂点カラー
	print_bc(object_num);
	if ( enter_f == 1 ) {
		printf("\n");
	}
	for ( i = 0; i < object_num; i++ ) {
		print_bc(object[i]->coord_size / 3);
		for ( j = 0; j < object[i]->coord_size / 3; j++ ) {
			if ( object[i]->color_size == 0 ) {
				// グレー
				sprintf(tmp, "%f", 0.5f); printf("%s,", f(tmp, 1.0f));
				sprintf(tmp, "%f", 0.5f); printf("%s,", f(tmp, 1.0f));
				sprintf(tmp, "%f", 0.5f); printf("%s,", f(tmp, 1.0f));
			} else {
				sprintf(tmp, "%f", object[i]->color[j * 3    ]); printf("%s,", f(tmp, 1.0f));
				sprintf(tmp, "%f", object[i]->color[j * 3 + 1]); printf("%s,", f(tmp, 1.0f));
				sprintf(tmp, "%f", object[i]->color[j * 3 + 2]); printf("%s,", f(tmp, 1.0f));
			}
		}
		if ( enter_f == 1 ) {
			printf("\n");
		}
	}

	// テクスチャマップ
	print_bc(object_num);
	if ( enter_f == 1 ) {
		printf("\n");
	}
	for ( i = 0; i < object_num; i++ ) {
		print_bc(object[i]->map_size / 2);
		for ( j = 0; j < object[i]->map_size / 2; j++ ) {
			sprintf(tmp, "%f", object[i]->map[j * 2    ]); printf("%s,", f(tmp, 1.0f));
			sprintf(tmp, "%f", object[i]->map[j * 2 + 1]); printf("%s,", f(tmp, 1.0f));
		}
		if ( enter_f == 1 ) {
			printf("\n");
		}
	}

	// 三角形ストリップ
	tri_num = 0;
	print_bc(object_num);
	if ( enter_f == 1 ) {
		printf("\n");
	}
	for ( i = 0; i < object_num; i++ ) {
		// 三角形ストリップ毎の平行移動
if ( string_f == 1 ) {
		printf(",,,");
} else {
		printf("0,0,0,");
}
		if ( enter_f == 1 ) {
			printf("\n");
		}

		// 三角形ストリップ毎の回転
if ( string_f == 1 ) {
		printf(",,,,");
} else {
		printf("0,0,0,0,");
}
		if ( enter_f == 1 ) {
			printf("\n");
		}

		print_bc(-1);	// テクスチャ・インデックス
		if ( enter_f == 1 ) {
			printf("\n");
		}
if ( (string_f == 1) && (i == 0) ) {
		printf(",,,,");
} else {
		printf("%d,", i);	// 頂点のグループ・インデックス
		printf("%d,", i);	// 法線のグループ・インデックス
		printf("%d,", i);	// 頂点カラーのグループ・インデックス
		printf("%d,", i);	// テクスチャマップのグループ・インデックス
}
		if ( enter_f == 1 ) {
			printf("\n");
		}

		print(object[i]->coord_size / 3);
		offset = 0;
		for ( j = i - 1; j >= 0; j-- ) {
			offset += object[j]->coord_size / 3;
		}
		make_strip(object[i]->coord_index, object[i]->coord_index_size, offset);
		printf(",");
		if ( enter_f == 1 ) {
			printf("\n");
		}
	}

	// 三角形の数
if ( string_f == 1 ) {
	printf("%d,\"\n", tri_num);
} else {
	printf("%d,\n", tri_num);
}

	// オブジェクト
	for ( i = 0; i < object_num; i++ ) {
		free_object(&object[i]);
	}
	free(object);

	// グローバル
	if ( g_coord != NULL ) {
		free(g_coord);
	}
	if ( g_color != NULL ) {
		free(g_color);
	}
	if ( g_map != NULL ) {
		free(g_map);
	}
	if ( g_normal != NULL ) {
		free(g_normal);
	}

	return 0;
}
