#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char keta[8];

// Geometry
typedef struct {
	char* geometry_id;
	double* vertices;
	int vertices_size;
	int* vertex_index;
	int vertex_index_size;
	double* colors;
	int colors_size;
	int* color_index;
	int color_index_size;
	double* uv;
	int uv_size;
	int* uv_index;
	int uv_index_size;
} geometry_t;
geometry_t** geometry;
int geometry_num;
void new_geometry(geometry_t** data) {
	*data = (geometry_t*)malloc(sizeof(geometry_t));
	(*data)->geometry_id = NULL;
	(*data)->vertices = NULL;
	(*data)->vertices_size = 0;
	(*data)->vertex_index = NULL;
	(*data)->vertex_index_size = 0;
	(*data)->colors = NULL;
	(*data)->colors_size = 0;
	(*data)->color_index = NULL;
	(*data)->color_index_size = 0;
	(*data)->uv = NULL;
	(*data)->uv_size = 0;
	(*data)->uv_index = NULL;
	(*data)->uv_index_size = 0;
}
void free_geometry(geometry_t** data) {
	if ( (*data)->geometry_id != NULL ) {
		free((*data)->geometry_id);
	}
	if ( (*data)->vertices != NULL ) {
		free((*data)->vertices);
	}
	if ( (*data)->vertex_index != NULL ) {
		free((*data)->vertex_index);
	}
	if ( (*data)->colors != NULL ) {
		free((*data)->colors);
	}
	if ( (*data)->color_index != NULL ) {
		free((*data)->color_index);
	}
	if ( (*data)->uv != NULL ) {
		free((*data)->uv);
	}
	if ( (*data)->uv_index != NULL ) {
		free((*data)->uv_index);
	}
	free(*data);
}
void print_geometry() {
	int i, j;
	for ( i = 0; i < geometry_num; i++ ) {
		if ( geometry[i]->geometry_id != NULL ) {
			printf("geometry_id[%d] %s\n", i, geometry[i]->geometry_id);
		}
		if ( geometry[i]->vertices != NULL ) {
			printf("vertices[%d] %d ", i, geometry[i]->vertices_size);
			for ( j = 0; j < geometry[i]->vertices_size; j++ ) {
				if ( j > 0 ) {
					printf(",");
				}
				printf("%f", geometry[i]->vertices[j]);
			}
			printf("\n");
		}
		if ( geometry[i]->vertex_index != NULL ) {
			printf("vertex_index[%d] %d ", i, geometry[i]->vertex_index_size);
			for ( j = 0; j < geometry[i]->vertex_index_size; j++ ) {
				if ( j > 0 ) {
					printf(",");
				}
				printf("%d", geometry[i]->vertex_index[j]);
			}
			printf("\n");
		}
		if ( geometry[i]->colors != NULL ) {
			printf("colors[%d] %d ", i, geometry[i]->colors_size);
			for ( j = 0; j < geometry[i]->colors_size; j++ ) {
				if ( j > 0 ) {
					printf(",");
				}
				printf("%f", geometry[i]->colors[j]);
			}
			printf("\n");
		}
		if ( geometry[i]->color_index != NULL ) {
			printf("color_index[%d] %d ", i, geometry[i]->color_index_size);
			for ( j = 0; j < geometry[i]->color_index_size; j++ ) {
				if ( j > 0 ) {
					printf(",");
				}
				printf("%d", geometry[i]->color_index[j]);
			}
			printf("\n");
		}
		if ( geometry[i]->uv != NULL ) {
			printf("uv[%d] %d ", i, geometry[i]->uv_size);
			for ( j = 0; j < geometry[i]->uv_size; j++ ) {
				if ( j > 0 ) {
					printf(",");
				}
				printf("%f", geometry[i]->uv[j]);
			}
			printf("\n");
		}
		if ( geometry[i]->uv_index != NULL ) {
			printf("uv_index[%d] %d ", i, geometry[i]->uv_index_size);
			for ( j = 0; j < geometry[i]->uv_index_size; j++ ) {
				if ( j > 0 ) {
					printf(",");
				}
				printf("%d", geometry[i]->uv_index[j]);
			}
			printf("\n");
		}
	}
}

// Model
typedef struct {
	char* model_id;
	double trans_x;
	double trans_y;
	double trans_z;
	double rot_x;
	double rot_y;
	double rot_z;
	double scale_x;
	double scale_y;
	double scale_z;
} model_t;
model_t** model;
int model_num;
void new_model(model_t** data) {
	*data = (model_t*)malloc(sizeof(model_t));
	(*data)->model_id = NULL;
	(*data)->trans_x = 0.0f;
	(*data)->trans_y = 0.0f;
	(*data)->trans_z = 0.0f;
	(*data)->rot_x = 0.0f;
	(*data)->rot_y = 0.0f;
	(*data)->rot_z = 0.0f;
	(*data)->scale_x = 1.0f;
	(*data)->scale_y = 1.0f;
	(*data)->scale_z = 1.0f;
}
void free_model(model_t** data) {
	if ( (*data)->model_id != NULL ) {
		free((*data)->model_id);
	}
	free(*data);
}
void print_model() {
	int i;
	for ( i = 0; i < model_num; i++ ) {
		if ( model[i]->model_id != NULL ) {
			printf("model_id[%d] %s\n", i, model[i]->model_id);
		}
		printf("trans[%d] %f,%f,%f\n", i, model[i]->trans_x, model[i]->trans_y, model[i]->trans_z);
		printf("rot[%d] %f,%f,%f\n", i, model[i]->rot_x, model[i]->rot_y, model[i]->rot_z);
		printf("scale[%d] %f,%f,%f\n", i, model[i]->scale_x, model[i]->scale_y, model[i]->scale_z);
	}
}

// Material
typedef struct {
	char* material_id;
	double emissive_r;
	double emissive_g;
	double emissive_b;
	double ambient_r;
	double ambient_g;
	double ambient_b;
	double diffuse_r;
	double diffuse_g;
	double diffuse_b;
	double specular_r;
	double specular_g;
	double specular_b;
	double shininess;
} material_t;
material_t** material;
int material_num;
void new_material(material_t** data) {
	*data = (material_t*)malloc(sizeof(material_t));
	(*data)->material_id = NULL;
	(*data)->emissive_r = 0.0f;
	(*data)->emissive_g = 0.0f;
	(*data)->emissive_b = 0.0f;
	(*data)->ambient_r = 0.0f;
	(*data)->ambient_g = 0.0f;
	(*data)->ambient_b = 0.0f;
	(*data)->diffuse_r = 0.0f;
	(*data)->diffuse_g = 0.0f;
	(*data)->diffuse_b = 0.0f;
	(*data)->specular_r = 0.0f;
	(*data)->specular_g = 0.0f;
	(*data)->specular_b = 0.0f;
	(*data)->shininess = 0.0f;
}
void free_material(material_t** data) {
	if ( (*data)->material_id != NULL ) {
		free((*data)->material_id);
	}
	free(*data);
}
void print_material() {
	int i;
	for ( i = 0; i < material_num; i++ ) {
		if ( material[i]->material_id != NULL ) {
			printf("material_id[%d] %s\n", i, material[i]->material_id);
		}
		printf("emissive[%d] %f,%f,%f\n", i, material[i]->emissive_r, material[i]->emissive_g, material[i]->emissive_b);
		printf("ambient[%d] %f,%f,%f\n", i, material[i]->ambient_r, material[i]->ambient_g, material[i]->ambient_b);
		printf("diffuse[%d] %f,%f,%f\n", i, material[i]->diffuse_r, material[i]->diffuse_g, material[i]->diffuse_b);
		printf("specular[%d] %f,%f,%f\n", i, material[i]->specular_r, material[i]->specular_g, material[i]->specular_b);
		printf("shininess[%d] %f\n", i, material[i]->shininess);
	}
}

// Texture
typedef struct {
	char* texture_id;
	char* file_name;
	char* file_name2;
	int texture_index;
} texture_t;
texture_t** texture;
int texture_num;
void new_texture(texture_t** data) {
	*data = (texture_t*)malloc(sizeof(texture_t));
	(*data)->texture_id = NULL;
	(*data)->file_name = NULL;
	(*data)->file_name2 = NULL;
	(*data)->texture_index = -1;
}
void free_texture(texture_t** data) {
	if ( (*data)->texture_id != NULL ) {
		free((*data)->texture_id);
	}
	if ( (*data)->file_name != NULL ) {
		free((*data)->file_name);
	}
	if ( (*data)->file_name2 != NULL ) {
		free((*data)->file_name2);
	}
	free(*data);
}
void print_texture() {
	int i;
	for ( i = 0; i < texture_num; i++ ) {
		if ( texture[i]->texture_id != NULL ) {
			printf("texture_id[%d] %s\n", i, texture[i]->texture_id);
		}
		if ( texture[i]->file_name != NULL ) {
			printf("file_name[%d] %s\n", i, texture[i]->file_name);
		}
		if ( texture[i]->file_name2 != NULL ) {
			printf("file_name2[%d] %s\n", i, texture[i]->file_name2);
		}
		printf("texture_index[%d] %d\n", i, texture[i]->texture_index);
	}
}

// Connection
typedef struct {
	char* model_id;
	char* geometry_id;
	char* material_id;
} conn_geometry_t;
conn_geometry_t** conn_geometry;
int conn_geometry_num;
typedef struct {
	char* material_id;
	char* texture_id;
} conn_material_t;
conn_material_t** conn_material;
int conn_material_num;
void new_conn_geometry(conn_geometry_t** data) {
	*data = (conn_geometry_t*)malloc(sizeof(conn_geometry_t));
	(*data)->model_id = NULL;
	(*data)->geometry_id = NULL;
	(*data)->material_id = NULL;
}
void free_conn_geometry(conn_geometry_t** data) {
	if ( (*data)->model_id != NULL ) {
		free((*data)->model_id);
	}
	if ( (*data)->geometry_id != NULL ) {
		free((*data)->geometry_id);
	}
	if ( (*data)->material_id != NULL ) {
		free((*data)->material_id);
	}
	free(*data);
}
void new_conn_material(conn_material_t** data) {
	*data = (conn_material_t*)malloc(sizeof(conn_material_t));
	(*data)->material_id = NULL;
	(*data)->texture_id = NULL;
}
void free_conn_material(conn_material_t** data) {
	if ( (*data)->material_id != NULL ) {
		free((*data)->material_id);
	}
	if ( (*data)->texture_id != NULL ) {
		free((*data)->texture_id);
	}
	free(*data);
}
void print_conn_geometry() {
	int i;
	for ( i = 0; i < conn_geometry_num; i++ ) {
		if ( conn_geometry[i]->model_id != NULL ) {
			printf("model_id[%d] %s\n", i, conn_geometry[i]->model_id);
		}
		if ( conn_geometry[i]->geometry_id != NULL ) {
			printf("geometry_id[%d] %s\n", i, conn_geometry[i]->geometry_id);
		}
		if ( conn_geometry[i]->material_id != NULL ) {
			printf("material_id[%d] %s\n", i, conn_geometry[i]->material_id);
		}
	}
}
void print_conn_material() {
	int i;
	for ( i = 0; i < conn_material_num; i++ ) {
		if ( conn_material[i]->material_id != NULL ) {
			printf("material_id[%d] %s\n", i, conn_material[i]->material_id);
		}
		if ( conn_material[i]->texture_id != NULL ) {
			printf("texture_id[%d] %s\n", i, conn_material[i]->texture_id);
		}
	}
}
int cmp_conn(char* str1, char* str2) {
	if ( (str1 != NULL) && (str2 != NULL) ) {
		return strcmp(str1, str2);
	}
	return -1;
}

void _init() {
	geometry = NULL;
	geometry_num = 0;
	model = NULL;
	model_num = 0;
	material = NULL;
	material_num = 0;
	texture = NULL;
	texture_num = 0;
	conn_geometry = NULL;
	conn_geometry_num = 0;
	conn_material = NULL;
	conn_material_num = 0;
}
void add_geometry() {
	geometry_num++;
	if ( geometry_num == 1 ) {
		geometry = (geometry_t**)malloc(sizeof(geometry_t*) * geometry_num);
	} else {
		geometry = (geometry_t**)realloc(geometry, sizeof(geometry_t*) * geometry_num);
	}
	new_geometry(&geometry[geometry_num - 1]);
}
void add_geometry_vertices(char* data) {
	geometry[geometry_num - 1]->vertices_size++;
	if ( geometry[geometry_num - 1]->vertices_size == 1 ) {
		geometry[geometry_num - 1]->vertices = (double*)malloc(sizeof(double) * geometry[geometry_num - 1]->vertices_size);
	} else {
		geometry[geometry_num - 1]->vertices = (double*)realloc(geometry[geometry_num - 1]->vertices, sizeof(double) * geometry[geometry_num - 1]->vertices_size);
	}
	geometry[geometry_num - 1]->vertices[geometry[geometry_num - 1]->vertices_size - 1] = atof(data);
}
void add_geometry_vertex_index(char* data) {
	geometry[geometry_num - 1]->vertex_index_size++;
	if ( geometry[geometry_num - 1]->vertex_index_size == 1 ) {
		geometry[geometry_num - 1]->vertex_index = (int*)malloc(sizeof(int) * geometry[geometry_num - 1]->vertex_index_size);
	} else {
		geometry[geometry_num - 1]->vertex_index = (int*)realloc(geometry[geometry_num - 1]->vertex_index, sizeof(int) * geometry[geometry_num - 1]->vertex_index_size);
	}
	geometry[geometry_num - 1]->vertex_index[geometry[geometry_num - 1]->vertex_index_size - 1] = atoi(data);
}
void add_geometry_colors(char* data) {
	geometry[geometry_num - 1]->colors_size++;
	if ( geometry[geometry_num - 1]->colors_size == 1 ) {
		geometry[geometry_num - 1]->colors = (double*)malloc(sizeof(double) * geometry[geometry_num - 1]->colors_size);
	} else {
		geometry[geometry_num - 1]->colors = (double*)realloc(geometry[geometry_num - 1]->colors, sizeof(double) * geometry[geometry_num - 1]->colors_size);
	}
	geometry[geometry_num - 1]->colors[geometry[geometry_num - 1]->colors_size - 1] = atof(data);
}
void add_geometry_color_index(char* data) {
	geometry[geometry_num - 1]->color_index_size++;
	if ( geometry[geometry_num - 1]->color_index_size == 1 ) {
		geometry[geometry_num - 1]->color_index = (int*)malloc(sizeof(int) * geometry[geometry_num - 1]->color_index_size);
	} else {
		geometry[geometry_num - 1]->color_index = (int*)realloc(geometry[geometry_num - 1]->color_index, sizeof(int) * geometry[geometry_num - 1]->color_index_size);
	}
	geometry[geometry_num - 1]->color_index[geometry[geometry_num - 1]->color_index_size - 1] = atoi(data);
}
void add_geometry_uv(char* data) {
	geometry[geometry_num - 1]->uv_size++;
	if ( geometry[geometry_num - 1]->uv_size == 1 ) {
		geometry[geometry_num - 1]->uv = (double*)malloc(sizeof(double) * geometry[geometry_num - 1]->uv_size);
	} else {
		geometry[geometry_num - 1]->uv = (double*)realloc(geometry[geometry_num - 1]->uv, sizeof(double) * geometry[geometry_num - 1]->uv_size);
	}
	geometry[geometry_num - 1]->uv[geometry[geometry_num - 1]->uv_size - 1] = atof(data);
}
void add_geometry_uv_index(char* data) {
	geometry[geometry_num - 1]->uv_index_size++;
	if ( geometry[geometry_num - 1]->uv_index_size == 1 ) {
		geometry[geometry_num - 1]->uv_index = (int*)malloc(sizeof(int) * geometry[geometry_num - 1]->uv_index_size);
	} else {
		geometry[geometry_num - 1]->uv_index = (int*)realloc(geometry[geometry_num - 1]->uv_index, sizeof(int) * geometry[geometry_num - 1]->uv_index_size);
	}
	geometry[geometry_num - 1]->uv_index[geometry[geometry_num - 1]->uv_index_size - 1] = atoi(data);
}
void add_model() {
	model_num++;
	if ( model_num == 1 ) {
		model = (model_t**)malloc(sizeof(model_t*) * model_num);
	} else {
		model = (model_t**)realloc(model, sizeof(model_t*) * model_num);
	}
	new_model(&model[model_num - 1]);
}
void add_material() {
	material_num++;
	if ( material_num == 1 ) {
		material = (material_t**)malloc(sizeof(material_t*) * material_num);
	} else {
		material = (material_t**)realloc(material, sizeof(material_t*) * material_num);
	}
	new_material(&material[material_num - 1]);
}
void add_texture() {
	texture_num++;
	if ( texture_num == 1 ) {
		texture = (texture_t**)malloc(sizeof(texture_t*) * texture_num);
	} else {
		texture = (texture_t**)realloc(texture, sizeof(texture_t*) * texture_num);
	}
	new_texture(&texture[texture_num - 1]);
}
void add_conn_geometry() {
	conn_geometry_num++;
	if ( conn_geometry_num == 1 ) {
		conn_geometry = (conn_geometry_t**)malloc(sizeof(conn_geometry_t*) * conn_geometry_num);
	} else {
		conn_geometry = (conn_geometry_t**)realloc(conn_geometry, sizeof(conn_geometry_t*) * conn_geometry_num);
	}
	new_conn_geometry(&conn_geometry[conn_geometry_num - 1]);
}
void add_conn_material() {
	conn_material_num++;
	if ( conn_material_num == 1 ) {
		conn_material = (conn_material_t**)malloc(sizeof(conn_material_t*) * conn_material_num);
	} else {
		conn_material = (conn_material_t**)realloc(conn_material, sizeof(conn_material_t*) * conn_material_num);
	}
	new_conn_material(&conn_material[conn_material_num - 1]);
}
void _free() {
	int i;
	for ( i = 0; i < geometry_num; i++ ) {
		free_geometry(&geometry[i]);
	}
	free(geometry);
	for ( i = 0; i < model_num; i++ ) {
		free_model(&model[i]);
	}
	free(model);
	for ( i = 0; i < material_num; i++ ) {
		free_material(&material[i]);
	}
	free(material);
	for ( i = 0; i < texture_num; i++ ) {
		free_texture(&texture[i]);
	}
	free(texture);
	for ( i = 0; i < conn_geometry_num; i++ ) {
		free_conn_geometry(&conn_geometry[i]);
	}
	free(conn_geometry);
	for ( i = 0; i < conn_material_num; i++ ) {
		free_conn_material(&conn_material[i]);
	}
	free(conn_material);
}

int tri_num;

// 三角形
typedef struct {
	int a, b, c;
} triangle_t;

// 三角形ストリップ
typedef struct {
	int* data;
	int size;
	int capacity;
} strip_t;

void init_strip(strip_t* strip) {
	strip->size = 0;
	strip->capacity = 16;
	strip->data = (int*)malloc(sizeof(int) * strip->capacity);
}
void push(strip_t* strip, int value) {
	if ( strip->size >= strip->capacity ) {
		strip->capacity *= 2;
		strip->data = (int*)realloc(strip->data, sizeof(int) * strip->capacity);
	}
	strip->data[strip->size++] = value;
}
void free_strip(strip_t* strip) {
	free(strip->data);
}

void make_strip1(strip_t* face, strip_t* strip) {
	int face_num = face->size / 3;
	int i;
	int last_index = -1;
	int next_reverse = 0;
	for ( i = 0; i < face_num; i++ ) {
		if ( last_index >= 0 ) {
			// インデックスを2個追加
			push(strip, last_index);
			push(strip, face->data[i * 3]);
		}
		if ( next_reverse == 1 ) {
			// 前回が反転でない三角形の場合、反転させる
			last_index = face->data[i * 3    ]; push(strip, last_index);
			last_index = face->data[i * 3 + 2]; push(strip, last_index);
			last_index = face->data[i * 3 + 1]; push(strip, last_index);
			next_reverse = 0;
		} else {
			last_index = face->data[i * 3    ]; push(strip, last_index);
			last_index = face->data[i * 3 + 1]; push(strip, last_index);
			last_index = face->data[i * 3 + 2]; push(strip, last_index);
			next_reverse = 1;
		}
	}
	tri_num += face_num;
}

void make_strip2(strip_t* face, strip_t* result) {
	int face_num = face->size / 3;
	int i, j, k;

	// 三角形リストを作成
	triangle_t** triangles = (triangle_t**)malloc(sizeof(triangle_t*) * face_num);
	for ( i = 0; i < face_num; i++ ) {
		triangles[i] = (triangle_t*)malloc(sizeof(triangle_t));
		triangles[i]->a = face->data[i * 3    ];
		triangles[i]->b = face->data[i * 3 + 1];
		triangles[i]->c = face->data[i * 3 + 2];
	}
	tri_num += face_num;

	// 複数ストリップ構築
	char* used = (char*)calloc(face_num, sizeof(char));
	strip_t** strips = (strip_t**)malloc(sizeof(strip_t*) * face_num);
	int strips_count = 0;
	for ( k = 0; k < face_num; k++ ) {
		if ( used[k] == 1 ) {
			continue;
		}
		int cur_index = k;
		triangle_t* cur = triangles[cur_index];
		used[cur_index] = 1;
		strips[strips_count] = (strip_t*)malloc(sizeof(strip_t));
		init_strip(strips[strips_count]);
		push(strips[strips_count], cur->a);
		push(strips[strips_count], cur->b);
		push(strips[strips_count], cur->c);
		// ストリップを伸ばす
		char extended = 1;
		while ( extended == 1 ) {
			extended = 0;
			// 末尾2頂点
			int last2[2];
			last2[0] = strips[strips_count]->data[strips[strips_count]->size - 2];
			last2[1] = strips[strips_count]->data[strips[strips_count]->size - 1];
			// 末尾2頂点を共有する未使用三角形を探す
			for ( i = 0; i < face_num; i++ ) {
				if ( used[i] == 1 || i == cur_index ) {
					continue;
				}
				// 新しい三角形
				int next_triangle[3];
				next_triangle[0] = triangles[i]->a;
				next_triangle[1] = triangles[i]->b;
				next_triangle[2] = triangles[i]->c;
				for ( j = 0; j < 3; j++ ) {
					int a = next_triangle[j];
					int b = next_triangle[(j + 1) % 3];
					if ( (a == last2[0] && b == last2[1]) || (a == last2[1] && b == last2[0]) ) {
						// last2の順に並ぶように新三角形の頂点を並び変える
						int next[3];
						if ( a == last2[0] && b == last2[1] ) {
							next[0] = next_triangle[j];
							next[1] = next_triangle[(j + 1) % 3];
							next[2] = next_triangle[(j + 2) % 3];
						} else {
							next[0] = next_triangle[(j + 1) % 3];
							next[1] = next_triangle[j];
							next[2] = next_triangle[(j + 2) % 3];
						}
						// 追加
						push(strips[strips_count], next[2]);
						used[i] = 1;
						cur_index = i;
						cur = triangles[cur_index];
						cur->a = next[0];
						cur->b = next[1];
						cur->c = next[2];
						extended = 1;
						break;
					}
				}
				if ( extended == 1 ) {
					break;
				}
			}
		}
		strips_count++;
	}

	// 複数ストリップを繋げる
	for ( i = 0; i < strips_count; i++ ) {
		if ( i > 0 ) {
			// 前ストリップの最後の頂点
			int prev = result->data[result->size - 1];
			// 今ストリップの最初の頂点
			int next = strips[i]->data[0];
			// 縮退三角形を挟む
			push(result, prev);
			push(result, next);
			// 前ストリップの長さが奇数なら、もう1つ縮退三角形を挟む
			if ( (strips[i - 1]->size % 2) == 1 ) {
				push(result, next);
			}
		}
		for ( j = 0; j < strips[i]->size; j++ ) {
			push(result, strips[i]->data[j]);
		}
		free_strip(strips[i]);
		free(strips[i]);
	}

	// 後始末
	for ( i = 0; i < face_num; i++ ) {
		free(triangles[i]);
	}
	free(triangles);
	free(used);
	free(strips);
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

int main(int argc, char* argv[]) {
	int i, j, k, l;

	int cnt;

	double scale;
	double ambient;
	double diffuse;

	FILE* texture_fp;
	FILE* in;

	char* line;
	int line_len;

	char* top;
	char* end;

	char tmp1[64];
	char tmp2[64];
	char* geometry_id;
	char* model_id;
	char* material_id;
	char* texture_id;

	char tmp_texture[256];

	int mode;
	int mode_sub;
	int a_f;
	int a_mode;

	int texture_index;

	double** normals;
	double** colors;
	double** uv;
	strip_t** strips;

	int optimize_level;
	int debug_f;
	int enter_f;
//	int string_f;
	int offset;

	optimize_level = 0;
	debug_f = 0;
	enter_f = 0;
	string_f = 0;
	offset = 0;
	if ( argc > offset + 1 ) {
		if ( stricmp(argv[offset + 1], "-o") == 0 ) {
			optimize_level = 1;
			offset++;
		}
	}
	if ( argc > offset + 1 ) {
		if ( strcmp(argv[offset + 1], "-E") == 0 ) {
			debug_f = 1;
			enter_f = 1;
			offset++;
		} else if ( stricmp(argv[offset + 1], "-e") == 0 ) {
			enter_f = 1;
			offset++;
		} else if ( stricmp(argv[offset + 1], "-s") == 0 ) {
			string_f = 1;
			offset++;
		}
	}

	if ( argc < 8 + offset ) {
		printf("usage: %s [-o] [-E|-e|-s] <fbx_file> <keta> <scale> <ambient> <diffuse> <texture_file_list> <line_length>\n", progName(argv[0]));
		return 0;
	}

	sprintf(keta, "%%.%df", atoi(argv[2 + offset]));
	scale = atof(argv[3 + offset]);
	ambient = atof(argv[4 + offset]);
	diffuse = atof(argv[5 + offset]);
	line_len = atoi(argv[7 + offset]);

	_init();

	line = malloc(line_len);

	if ( (in = fopen(argv[1 + offset], "rt")) != NULL ) {
		mode = -1;
		a_mode = -1;
		while ( fgets2(line, line_len - 1, in) != NULL ) {
			if ( strncmp(line, "\tGeometry: ", 11) == 0 ) {
				mode = 0; // Geometry取り込みモード
				mode_sub = -1;

				add_geometry();

				// geometry_id
				tmp1[0] = '\0';
				top = &line[11];
				if ( (end = strchr(top, ',')) != NULL ) {
					*end = '\0';
					strncpy(tmp1, top, 63); tmp1[63] = '\0';
				}
				geometry[geometry_num - 1]->geometry_id = strdup(tmp1);
			}
			if ( strncmp(line, "\tModel: ", 8) == 0 ) {
				mode = 1; // Model取り込みモード

				add_model();

				// model_id
				tmp1[0] = '\0';
				top = &line[8];
				if ( (end = strchr(top, ',')) != NULL ) {
					*end = '\0';
					strncpy(tmp1, top, 63); tmp1[63] = '\0';
				}
				model[model_num - 1]->model_id = strdup(tmp1);
			}
			if ( strncmp(line, "\tMaterial: ", 11) == 0 ) {
				mode = 2; // Material取り込みモード

				add_material();

				// material_id
				tmp1[0] = '\0';
				top = &line[11];
				if ( (end = strchr(top, ',')) != NULL ) {
					*end = '\0';
					strncpy(tmp1, top, 63); tmp1[63] = '\0';
				}
				material[material_num - 1]->material_id = strdup(tmp1);
			}
			if ( strncmp(line, "\tTexture: ", 10) == 0 ) {
				mode = 3; // Texture取り込みモード

				add_texture();

				// texture_id
				tmp1[0] = '\0';
				top = &line[10];
				if ( (end = strchr(top, ',')) != NULL ) {
					*end = '\0';
					strncpy(tmp1, top, 63); tmp1[63] = '\0';
				}
				texture[texture_num - 1]->texture_id = strdup(tmp1);
			}
			if ( strncmp(line, "\t}", 2) == 0 ) {
				mode = -1;
			}
			if ( mode == 0 ) { // Geometry取り込みモード
				if ( mode_sub == 0 ) { // LayerElementColor取り込みサブモード
					if ( strncmp(line, "\t\t}", 3) == 0 ) {
						mode_sub = -1;
					} else {
						if ( strstr(line, "Colors: ") != NULL ) {
							a_mode = 2;
						}
						if ( strstr(line, "ColorIndex: ") != NULL ) {
							a_mode = 3;
						}
					}
				} else if ( mode_sub == 1 ) { // LayerElementUV取り込みサブモード
					if ( strncmp(line, "\t\t}", 3) == 0 ) {
						mode_sub = -1;
					} else {
						if ( strstr(line, "UV: ") != NULL ) {
							a_mode = 4;
						}
						if ( strstr(line, "UVIndex: ") != NULL ) {
							a_mode = 5;
						}
					}
				}
				if ( strstr(line, "Vertices: ") != NULL ) {
					a_mode = 0;
				}
				if ( strstr(line, "PolygonVertexIndex: ") != NULL ) {
					a_mode = 1;
				}
				if ( strstr(line, "LayerElementColor: ") != NULL ) {
					mode_sub = 0; // LayerElementColor取り込みサブモード
				}
				if ( strstr(line, "LayerElementUV: ") != NULL ) {
					mode_sub = 1; // LayerElementUV取り込みサブモード
				}
				if ( a_mode >= 0 ) {
					a_f = 0;
					while ( fgets2(line, line_len - 1, in) != NULL ) {
						if ( a_mode == 0 ) { // Vertices
							if ( strncmp(line, "\t\t}", 3) == 0 ) {
								break;
							}
						}
						if ( a_mode == 1 ) { // PolygonVertexIndex
							if ( strncmp(line, "\t\t}", 3) == 0 ) {
								break;
							}
						}
						if ( a_mode == 2 ) { // Colors
							if ( strncmp(line, "\t\t\t}", 4) == 0 ) {
								break;
							}
						}
						if ( a_mode == 3 ) { // ColorIndex
							if ( strncmp(line, "\t\t\t}", 4) == 0 ) {
								break;
							}
						}
						if ( a_mode == 4 ) { // UV
							if ( strncmp(line, "\t\t\t}", 4) == 0 ) {
								break;
							}
						}
						if ( a_mode == 5 ) { // UVIndex
							if ( strncmp(line, "\t\t\t}", 4) == 0 ) {
								break;
							}
						}
						if ( (top = strstr(line, "a: ")) != NULL ) {
							a_f = 1;
							top += 3;
						} else {
							top = line;
						}
						if ( a_f == 1 ) {
							while ( 1 ) {
								if ( (end = strchr(top, ',')) != NULL ) {
									*end = '\0';
									strncpy(tmp1, top, 63); tmp1[63] = '\0';
									if ( a_mode == 0 ) { // Vertices
										add_geometry_vertices(tmp1);
									}
									if ( a_mode == 1 ) { // PolygonVertexIndex
										add_geometry_vertex_index(tmp1);
									}
									if ( a_mode == 2 ) { // Colors
										add_geometry_colors(tmp1);
									}
									if ( a_mode == 3 ) { // ColorIndex
										add_geometry_color_index(tmp1);
									}
									if ( a_mode == 4 ) { // UV
										add_geometry_uv(tmp1);
									}
									if ( a_mode == 5 ) { // UVIndex
										add_geometry_uv_index(tmp1);
									}
									top = &end[1];
									if ( *top == '\0' ) {
										break;
									}
								} else {
									strncpy(tmp1, top, 63); tmp1[63] = '\0';
									if ( strchr(tmp1, '}') != NULL ) {
										break;
									}
									if ( a_mode == 0 ) { // Vertices
										add_geometry_vertices(tmp1);
									}
									if ( a_mode == 1 ) { // PolygonVertexIndex
										add_geometry_vertex_index(tmp1);
									}
									if ( a_mode == 2 ) { // Colors
										add_geometry_colors(tmp1);
									}
									if ( a_mode == 3 ) { // ColorIndex
										add_geometry_color_index(tmp1);
									}
									if ( a_mode == 4 ) { // UV
										add_geometry_uv(tmp1);
									}
									if ( a_mode == 5 ) { // UVIndex
										add_geometry_uv_index(tmp1);
									}
									break;
								}
							}
						}
					}
					a_mode = -1;
				}
			} else if ( mode == 1 ) { // Model取り込みモード
				if ( (top = strstr(line, "P: ")) != NULL ) {
					top += 3;
					if ( (end = strchr(top, ',')) != NULL ) {
						*end = '\0';
						mode_sub = -1;
						if ( strstr(top, "Lcl Translation") != NULL ) {
							mode_sub = 0;
						} else if ( strstr(top, "Lcl Rotation") != NULL ) {
							mode_sub = 1;
						} else if ( strstr(top, "Lcl Scaling") != NULL ) {
							mode_sub = 2;
						}
						top = &end[1];
						if ( (end = strchr(top, ',')) != NULL ) {
							top = &end[1];
							if ( (end = strchr(top, ',')) != NULL ) {
								top = &end[1];
								if ( (end = strchr(top, ',')) != NULL ) {
									top = &end[1];
									if ( (end = strchr(top, ',')) != NULL ) {
										*end = '\0';
										switch ( mode_sub ) {
										case 0:
											model[model_num - 1]->trans_x = atof(top);
											break;
										case 1:
											model[model_num - 1]->rot_x = atof(top);
											break;
										case 2:
											model[model_num - 1]->scale_x = atof(top);
											break;
										}
										top = &end[1];
										if ( (end = strchr(top, ',')) != NULL ) {
											*end = '\0';
											switch ( mode_sub ) {
											case 0:
												model[model_num - 1]->trans_y = atof(top);
												break;
											case 1:
												model[model_num - 1]->rot_y = atof(top);
												break;
											case 2:
												model[model_num - 1]->scale_y = atof(top);
												break;
											}
											top = &end[1];
											if ( (end = strchr(top, ',')) != NULL ) {
												*end = '\0';
											}
											switch ( mode_sub ) {
											case 0:
												model[model_num - 1]->trans_z = atof(top);
												break;
											case 1:
												model[model_num - 1]->rot_z = atof(top);
												break;
											case 2:
												model[model_num - 1]->scale_z = atof(top);
												break;
											}
										}
									}
								}
							}
						}
					}
				}
			} else if ( mode == 2 ) { // Material取り込みモード
				if ( (top = strstr(line, "P: ")) != NULL ) {
					top += 3;
					if ( (end = strchr(top, ',')) != NULL ) {
						*end = '\0';
						mode_sub = -1;
						if ( strstr(top, "Emissive") != NULL ) {
							mode_sub = 0;
						} else if ( strstr(top, "Ambient") != NULL ) {
							mode_sub = 1;
						} else if ( strstr(top, "Diffuse") != NULL ) {
							mode_sub = 2;
						} else if ( strstr(top, "Specular") != NULL ) {
							mode_sub = 3;
						} else if ( strstr(top, "Shininess") != NULL ) {
							mode_sub = 4;
						}
						top = &end[1];
						if ( (end = strchr(top, ',')) != NULL ) {
							top = &end[1];
							if ( (end = strchr(top, ',')) != NULL ) {
								top = &end[1];
								if ( (end = strchr(top, ',')) != NULL ) {
									top = &end[1];
									if ( (end = strchr(top, ',')) != NULL ) {
										*end = '\0';
										switch ( mode_sub ) {
										case 0:
											material[material_num - 1]->emissive_r = atof(top);
											break;
										case 1:
											material[material_num - 1]->ambient_r = atof(top);
											break;
										case 2:
											material[material_num - 1]->diffuse_r = atof(top);
											break;
										case 3:
											material[material_num - 1]->specular_r = atof(top);
											break;
										case 4:
											material[material_num - 1]->shininess = atof(top);
											break;
										}
										top = &end[1];
										if ( (end = strchr(top, ',')) != NULL ) {
											*end = '\0';
											switch ( mode_sub ) {
											case 0:
												material[material_num - 1]->emissive_g = atof(top);
												break;
											case 1:
												material[material_num - 1]->ambient_g = atof(top);
												break;
											case 2:
												material[material_num - 1]->diffuse_g = atof(top);
												break;
											case 3:
												material[material_num - 1]->specular_g = atof(top);
												break;
											}
											top = &end[1];
											if ( (end = strchr(top, ',')) != NULL ) {
												*end = '\0';
											}
											switch ( mode_sub ) {
											case 0:
												material[material_num - 1]->emissive_b = atof(top);
												break;
											case 1:
												material[material_num - 1]->ambient_b = atof(top);
												break;
											case 2:
												material[material_num - 1]->diffuse_b = atof(top);
												break;
											case 3:
												material[material_num - 1]->specular_b = atof(top);
												break;
											}
										}
									} else {
										switch ( mode_sub ) {
										case 4:
											material[material_num - 1]->shininess = atof(top);
											break;
										}
									}
								}
							}
						}
					}
				}
			} else if ( mode == 3 ) { // Texture取り込みモード
				if ( (top = strstr(line, "\tFileName: ")) != NULL ) {
					top += 11;
					if ( texture[texture_num - 1]->file_name != NULL ) {
						free(texture[texture_num - 1]->file_name);
					}
					texture[texture_num - 1]->file_name = strdup(top);

					cnt = 0;
					if ( (texture_fp = fopen(argv[6 + offset], "rt")) != NULL ) {
						while ( fgets2(tmp_texture, 255, texture_fp) != NULL ) {
							if ( strstr(texture[texture_num - 1]->file_name, tmp_texture) != NULL ) {
								texture[texture_num - 1]->texture_index = cnt;
								break;
							}
							cnt++;
						}
						fclose(texture_fp);
					}
				}
				if ( (top = strstr(line, "\tRelativeFilename: ")) != NULL ) {
					top += 19;
					if ( texture[texture_num - 1]->file_name2 != NULL ) {
						free(texture[texture_num - 1]->file_name2);
					}
					texture[texture_num - 1]->file_name2 = strdup(top);

					cnt = 0;
					if ( (texture_fp = fopen(argv[6 + offset], "rt")) != NULL ) {
						while ( fgets2(tmp_texture, 255, texture_fp) != NULL ) {
							if ( strstr(texture[texture_num - 1]->file_name2, tmp_texture) != NULL ) {
								texture[texture_num - 1]->texture_index = cnt;
								break;
							}
							cnt++;
						}
						fclose(texture_fp);
					}
				}
			} else {
				if ( ((top = strstr(line, "C: \"OO\",")) != NULL) || ((top = strstr(line, "C: \"OP\",")) != NULL) ) {
					top += 8;
					if ( (end = strchr(top, ',')) != NULL ) {
						*end = '\0';
						strncpy(tmp1, top, 63); tmp1[63] = '\0';
						strncpy(tmp2, &end[1], 63); tmp2[63] = '\0';
						if ( (end = strchr(tmp2, ',')) != NULL ) {
							*end = '\0';
						}
						for ( i = 0; i < geometry_num; i++ ) {
							if ( cmp_conn(tmp1, geometry[i]->geometry_id) == 0 ) {
								geometry_id = tmp1;
								for ( j = 0; j < model_num; j++ ) {
									if ( cmp_conn(tmp2, model[j]->model_id) == 0 ) {
										model_id = tmp2;
										for ( k = 0; k < conn_geometry_num; k++ ) {
											if ( cmp_conn(model_id, conn_geometry[k]->model_id) == 0 ) {
												// 既存
												if ( conn_geometry[k]->geometry_id != NULL ) {
													free(conn_geometry[k]->geometry_id);
												}
												conn_geometry[k]->geometry_id = strdup(geometry_id);
											}
										}
										if ( k >= conn_geometry_num ) {
											// 新規
											add_conn_geometry();
											conn_geometry[conn_geometry_num - 1]->model_id = strdup(model_id);
											conn_geometry[conn_geometry_num - 1]->geometry_id = strdup(geometry_id);
										}
									}
								}
							}
						}
						for ( i = 0; i < model_num; i++ ) {
							if ( cmp_conn(tmp1, model[i]->model_id) == 0 ) {
								model_id = tmp1;
								for ( j = 0; j < geometry_num; j++ ) {
									if ( cmp_conn(tmp2, geometry[j]->geometry_id) == 0 ) {
										geometry_id = tmp2;
										for ( k = 0; k < conn_geometry_num; k++ ) {
											if ( cmp_conn(model_id, conn_geometry[k]->model_id) == 0 ) {
												// 既存
												if ( conn_geometry[k]->geometry_id != NULL ) {
													free(conn_geometry[k]->geometry_id);
												}
												conn_geometry[k]->geometry_id = strdup(geometry_id);
											}
										}
										if ( k >= conn_geometry_num ) {
											// 新規
											add_conn_geometry();
											conn_geometry[conn_geometry_num - 1]->model_id = strdup(model_id);
											conn_geometry[conn_geometry_num - 1]->geometry_id = strdup(geometry_id);
										}
									}
								}
								for ( j = 0; j < material_num; j++ ) {
									if ( cmp_conn(tmp2, material[j]->material_id) == 0 ) {
										material_id = tmp2;
										for ( k = 0; k < conn_geometry_num; k++ ) {
											if ( cmp_conn(model_id, conn_geometry[k]->model_id) == 0 ) {
												// 既存
												if ( conn_geometry[k]->material_id != NULL ) {
													free(conn_geometry[k]->material_id);
												}
												conn_geometry[k]->material_id = strdup(material_id);
											}
										}
										if ( k >= conn_geometry_num ) {
											// 新規
											add_conn_geometry();
											conn_geometry[conn_geometry_num - 1]->model_id = strdup(model_id);
											conn_geometry[conn_geometry_num - 1]->material_id = strdup(material_id);
										}
									}
								}
							}
						}
						for ( i = 0; i < material_num; i++ ) {
							if ( cmp_conn(tmp1, material[i]->material_id) == 0 ) {
								material_id = tmp1;
								for ( j = 0; j < model_num; j++ ) {
									if ( cmp_conn(tmp2, model[j]->model_id) == 0 ) {
										model_id = tmp2;
										for ( k = 0; k < conn_geometry_num; k++ ) {
											if ( cmp_conn(model_id, conn_geometry[k]->model_id) == 0 ) {
												// 既存
												if ( conn_geometry[k]->material_id != NULL ) {
													free(conn_geometry[k]->material_id);
												}
												conn_geometry[k]->material_id = strdup(material_id);
											}
										}
										if ( k >= conn_geometry_num ) {
											// 新規
											add_conn_geometry();
											conn_geometry[conn_geometry_num - 1]->model_id = strdup(model_id);
											conn_geometry[conn_geometry_num - 1]->material_id = strdup(material_id);
										}
									}
								}
								for ( j = 0; j < texture_num; j++ ) {
									if ( cmp_conn(tmp2, texture[j]->texture_id) == 0 ) {
										texture_id = tmp2;
										for ( k = 0; k < conn_material_num; k++ ) {
											if ( cmp_conn(material_id, conn_material[k]->material_id) == 0 ) {
												// 既存
												if ( conn_material[k]->texture_id != NULL ) {
													free(conn_material[k]->texture_id);
												}
												conn_material[k]->texture_id = strdup(texture_id);
											}
										}
										if ( k >= conn_material_num ) {
											// 新規
											add_conn_material();
											conn_material[conn_material_num - 1]->material_id = strdup(material_id);
											conn_material[conn_material_num - 1]->texture_id = strdup(texture_id);
										}
									}
								}
							}
						}
						for ( i = 0; i < texture_num; i++ ) {
							if ( cmp_conn(tmp1, texture[i]->texture_id) == 0 ) {
								texture_id = tmp1;
								for ( j = 0; j < material_num; j++ ) {
									if ( cmp_conn(tmp2, material[j]->material_id) == 0 ) {
										material_id = tmp2;
										for ( k = 0; k < conn_material_num; k++ ) {
											if ( cmp_conn(material_id, conn_material[k]->material_id) == 0 ) {
												// 既存
												if ( conn_material[k]->texture_id != NULL ) {
													free(conn_material[k]->texture_id);
												}
												conn_material[k]->texture_id = strdup(texture_id);
											}
										}
										if ( k >= conn_material_num ) {
											// 新規
											add_conn_material();
											conn_material[conn_material_num - 1]->material_id = strdup(material_id);
											conn_material[conn_material_num - 1]->texture_id = strdup(texture_id);
										}
									}
								}
							}
						}
					}
				}
			}
		}
		fclose(in);
	}

	free(line);

if ( debug_f == 1 ) {
	printf("/*\n");
	print_geometry();
	print_model();
	print_material();
	print_texture();
	print_conn_geometry();
	print_conn_material();
	printf("*/\n");
}

if ( string_f == 1 ) {
	printf("\"");
}

	// テクスチャ
	print_bc(material_num);
	if ( enter_f == 1 ) {
		printf("\n");
	}
	for ( i = 0; i < material_num; i++ ) {
		texture_index = -1;
		for ( j = 0; j < conn_material_num; j++ ) {
			if ( cmp_conn(conn_material[j]->material_id, material[i]->material_id) == 0 ) {
				for ( k = 0; k < texture_num; k++ ) {
					if ( cmp_conn(texture[k]->texture_id, conn_material[j]->texture_id) == 0 ) {
						texture_index = texture[k]->texture_index;
						break;
					}
				}
				if ( texture_index >= 0 ) {
					break;
				}
			}
		}
		print_bc(texture_index);
		printf("-1,");
		sprintf(tmp1, "%f", material[i]->diffuse_r ); printf("%s,", f(tmp1, 1.0f));
		sprintf(tmp1, "%f", material[i]->diffuse_g ); printf("%s,", f(tmp1, 1.0f));
		sprintf(tmp1, "%f", material[i]->diffuse_b ); printf("%s,", f(tmp1, 1.0f));
		printf("-1,");
		sprintf(tmp1, "%f", material[i]->ambient_r ); printf("%s,", f(tmp1, 1.0f));
		sprintf(tmp1, "%f", material[i]->ambient_g ); printf("%s,", f(tmp1, 1.0f));
		sprintf(tmp1, "%f", material[i]->ambient_b ); printf("%s,", f(tmp1, 1.0f));
		printf("-1,");
		sprintf(tmp1, "%f", material[i]->emissive_r); printf("%s,", f(tmp1, 1.0f));
		sprintf(tmp1, "%f", material[i]->emissive_g); printf("%s,", f(tmp1, 1.0f));
		sprintf(tmp1, "%f", material[i]->emissive_b); printf("%s,", f(tmp1, 1.0f));
		printf("-1,");
		sprintf(tmp1, "%f", material[i]->specular_r); printf("%s,", f(tmp1, 1.0f));
		sprintf(tmp1, "%f", material[i]->specular_g); printf("%s,", f(tmp1, 1.0f));
		sprintf(tmp1, "%f", material[i]->specular_b); printf("%s,", f(tmp1, 1.0f));
		sprintf(tmp1, "%f", material[i]->shininess ); printf("%s,", f(tmp1, 1.0f));
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

	normals = (double**)malloc(sizeof(double*) * geometry_num);
	colors = (double**)malloc(sizeof(double*) * geometry_num);
	uv = (double**)malloc(sizeof(double*) * geometry_num);
	strips = (strip_t**)malloc(sizeof(strip_t*) * geometry_num);
	tri_num = 0;

	// geometryごとの二次元配列
	for ( i = 0; i < geometry_num; i++ ) {
		// 頂点ごとに再構成する配列
		normals[i] = (double*)calloc(geometry[i]->vertices_size / 3 * 3, sizeof(double));
		colors[i]  = (double*)calloc(geometry[i]->vertices_size / 3 * 4, sizeof(double));
		uv[i]      = (double*)calloc(geometry[i]->vertices_size / 3 * 2, sizeof(double));

		// ポリゴン頂点ごとにループ
//		int normal_index = 0;
		int color_index  = 0;
		int uv_index     = 0;
		for ( j = 0; j < geometry[i]->vertex_index_size; j++ ) {
			int vertex_index = geometry[i]->vertex_index[j];
			if ( vertex_index < 0 ) {
				vertex_index = -vertex_index - 1;
			}

			// 法線
//			if (geometry[i]->normals_size > 0) {
//				normals[i][vertex_index * 3    ] = geometry[i]->normals[geometry[i]->normal_index[normal_index] * 3    ];
//				normals[i][vertex_index * 3 + 1] = geometry[i]->normals[geometry[i]->normal_index[normal_index] * 3 + 1];
//				normals[i][vertex_index * 3 + 2] = geometry[i]->normals[geometry[i]->normal_index[normal_index] * 3 + 2];
				normals[i][vertex_index * 3    ] = 0.0f;
				normals[i][vertex_index * 3 + 1] = 0.0f;
				normals[i][vertex_index * 3 + 2] = 0.0f;
//				normal_index++;
//			}

			// カラー
			if (geometry[i]->colors_size > 0) {
				colors[i][vertex_index * 4    ] = geometry[i]->colors[geometry[i]->color_index[color_index] * 4    ];
				colors[i][vertex_index * 4 + 1] = geometry[i]->colors[geometry[i]->color_index[color_index] * 4 + 1];
				colors[i][vertex_index * 4 + 2] = geometry[i]->colors[geometry[i]->color_index[color_index] * 4 + 2];
				colors[i][vertex_index * 4 + 3] = geometry[i]->colors[geometry[i]->color_index[color_index] * 4 + 3];
				color_index++;
			} else {
				for ( k = 0; k < conn_geometry_num; k++ ) {
					if ( cmp_conn(conn_geometry[k]->geometry_id, geometry[i]->geometry_id) == 0 ) {
						for ( l = 0; l < material_num; l++ ) {
							if ( cmp_conn(conn_geometry[k]->material_id, material[l]->material_id) == 0 ) {
								if ( ambient != 0.0 ) {
									colors[i][vertex_index * 4    ] = material[l]->ambient_r / ambient;
									colors[i][vertex_index * 4 + 1] = material[l]->ambient_g / ambient;
									colors[i][vertex_index * 4 + 2] = material[l]->ambient_b / ambient;
								}
								if ( diffuse != 0.0 ) {
									colors[i][vertex_index * 4    ] = material[l]->diffuse_r / diffuse;
									colors[i][vertex_index * 4 + 1] = material[l]->diffuse_g / diffuse;
									colors[i][vertex_index * 4 + 2] = material[l]->diffuse_b / diffuse;
								}
							}
						}
					}
				}
				colors[i][vertex_index * 4 + 3] = 1.0f;
			}

			// UV
			if (geometry[i]->uv_size > 0) {
				uv[i][vertex_index * 2    ] = geometry[i]->uv[geometry[i]->uv_index[uv_index] * 2    ];
				uv[i][vertex_index * 2 + 1] = geometry[i]->uv[geometry[i]->uv_index[uv_index] * 2 + 1];
				uv_index++;
			}
		}

		// 三角形ストリップ用データ
		strip_t* polygons = (strip_t*)malloc(sizeof(strip_t));
		init_strip(polygons);
		strip_t* poly = (strip_t*)malloc(sizeof(strip_t));
		init_strip(poly);
		for ( j = 0; j < geometry[i]->vertex_index_size; j++ ) {
			int vertex_index = geometry[i]->vertex_index[j];
			if ( vertex_index < 0 ) {
				vertex_index = -vertex_index - 1;
			}
			push(poly, vertex_index);
			if (geometry[i]->vertex_index[j] < 0) {
				// polyを三角形に分割してpolygonsにpush
				if ( poly->size == 3 ) {
					push(polygons, poly->data[0]);
					push(polygons, poly->data[1]);
					push(polygons, poly->data[2]);

					// 法線
					x_0 = geometry[i]->vertices[poly->data[0] * 3    ];
					y_0 = geometry[i]->vertices[poly->data[0] * 3 + 1];
					z_0 = geometry[i]->vertices[poly->data[0] * 3 + 2];
					x_1 = geometry[i]->vertices[poly->data[1] * 3    ];
					y_1 = geometry[i]->vertices[poly->data[1] * 3 + 1];
					z_1 = geometry[i]->vertices[poly->data[1] * 3 + 2];
					x_2 = geometry[i]->vertices[poly->data[2] * 3    ];
					y_2 = geometry[i]->vertices[poly->data[2] * 3 + 1];
					z_2 = geometry[i]->vertices[poly->data[2] * 3 + 2];
					cross(x_1 - x_0, y_1 - y_0, z_1 - z_0, x_2 - x_0, y_2 - y_0, z_2 - z_0);
					normalize(&cross_x, &cross_y, &cross_z);
					normals[i][poly->data[0] * 3    ] += cross_x;
					normals[i][poly->data[0] * 3 + 1] += cross_y;
					normals[i][poly->data[0] * 3 + 2] += cross_z;
					normalize(&normals[i][poly->data[0] * 3], &normals[i][poly->data[0] * 3 + 1], &normals[i][poly->data[0] * 3 + 2]);
					normals[i][poly->data[1] * 3    ] += cross_x;
					normals[i][poly->data[1] * 3 + 1] += cross_y;
					normals[i][poly->data[1] * 3 + 2] += cross_z;
					normalize(&normals[i][poly->data[1] * 3], &normals[i][poly->data[1] * 3 + 1], &normals[i][poly->data[1] * 3 + 2]);
					normals[i][poly->data[2] * 3    ] += cross_x;
					normals[i][poly->data[2] * 3 + 1] += cross_y;
					normals[i][poly->data[2] * 3 + 2] += cross_z;
					normalize(&normals[i][poly->data[2] * 3], &normals[i][poly->data[2] * 3 + 1], &normals[i][poly->data[2] * 3 + 2]);
				} else if ( poly->size > 3 ) {
					// 扇形分割
					for ( k = 1; k < poly->size - 1; k++ ) {
						push(polygons, poly->data[0    ]);
						push(polygons, poly->data[k    ]);
						push(polygons, poly->data[k + 1]);

						// 法線
						x_0 = geometry[i]->vertices[poly->data[0    ] * 3    ];
						y_0 = geometry[i]->vertices[poly->data[0    ] * 3 + 1];
						z_0 = geometry[i]->vertices[poly->data[0    ] * 3 + 2];
						x_1 = geometry[i]->vertices[poly->data[k    ] * 3    ];
						y_1 = geometry[i]->vertices[poly->data[k    ] * 3 + 1];
						z_1 = geometry[i]->vertices[poly->data[k    ] * 3 + 2];
						x_2 = geometry[i]->vertices[poly->data[k + 1] * 3    ];
						y_2 = geometry[i]->vertices[poly->data[k + 1] * 3 + 1];
						z_2 = geometry[i]->vertices[poly->data[k + 1] * 3 + 2];
						cross(x_1 - x_0, y_1 - y_0, z_1 - z_0, x_2 - x_0, y_2 - y_0, z_2 - z_0);
						normalize(&cross_x, &cross_y, &cross_z);
						normals[i][poly->data[0    ] * 3    ] += cross_x;
						normals[i][poly->data[0    ] * 3 + 1] += cross_y;
						normals[i][poly->data[0    ] * 3 + 2] += cross_z;
						normalize(&normals[i][poly->data[0] * 3], &normals[i][poly->data[0] * 3 + 1], &normals[i][poly->data[0] * 3 + 2]);
						normals[i][poly->data[k    ] * 3    ] += cross_x;
						normals[i][poly->data[k    ] * 3 + 1] += cross_y;
						normals[i][poly->data[k    ] * 3 + 2] += cross_z;
						normalize(&normals[i][poly->data[k] * 3], &normals[i][poly->data[k] * 3 + 1], &normals[i][poly->data[k] * 3 + 2]);
						normals[i][poly->data[k + 1] * 3    ] += cross_x;
						normals[i][poly->data[k + 1] * 3 + 1] += cross_y;
						normals[i][poly->data[k + 1] * 3 + 2] += cross_z;
						normalize(&normals[i][poly->data[k + 1] * 3], &normals[i][poly->data[k + 1] * 3 + 1], &normals[i][poly->data[k + 1] * 3 + 2]);
					}
				}
				free_strip(poly);
				init_strip(poly);
			}
		}
		free_strip(poly);
		free(poly);
		strips[i] = (strip_t*)malloc(sizeof(strip_t));
		init_strip(strips[i]);
		if ( optimize_level == 0 ) {
			make_strip1(polygons, strips[i]);
		} else {
			make_strip2(polygons, strips[i]);
		}
		free_strip(polygons);
		free(polygons);
	}

	// 頂点
	print_bc(geometry_num);
	if ( enter_f == 1 ) {
		printf("\n");
	}
	for ( i = 0; i < geometry_num; i++ ) {
		print_bc(geometry[i]->vertices_size / 3);
		for ( j = 0; j < geometry[i]->vertices_size; j++ ) {
			sprintf(tmp1, "%f", geometry[i]->vertices[j]); printf("%s,", f(tmp1, scale));
		}
		if ( enter_f == 1 ) {
			printf("\n");
		}
	}

	// 法線
	print_bc(geometry_num);
	if ( enter_f == 1 ) {
		printf("\n");
	}
	for ( i = 0; i < geometry_num; i++ ) {
		print_bc(geometry[i]->vertices_size / 3);
		for ( j = 0; j < geometry[i]->vertices_size / 3; j++ ) {
			sprintf(tmp1, "%f", normals[i][j * 3    ]); printf("%s,", f(tmp1, 1.0f));
			sprintf(tmp1, "%f", normals[i][j * 3 + 1]); printf("%s,", f(tmp1, 1.0f));
			sprintf(tmp1, "%f", normals[i][j * 3 + 2]); printf("%s,", f(tmp1, 1.0f));
		}
		if ( enter_f == 1 ) {
			printf("\n");
		}
	}

	// 頂点カラー
	print_bc(geometry_num);
	if ( enter_f == 1 ) {
		printf("\n");
	}
	for ( i = 0; i < geometry_num; i++ ) {
		print_bc(geometry[i]->vertices_size / 3);
		for ( j = 0; j < geometry[i]->vertices_size / 3; j++ ) {
			sprintf(tmp1, "%f", colors[i][j * 4    ]); printf("%s,", f(tmp1, 1.0f));
			sprintf(tmp1, "%f", colors[i][j * 4 + 1]); printf("%s,", f(tmp1, 1.0f));
			sprintf(tmp1, "%f", colors[i][j * 4 + 2]); printf("%s,", f(tmp1, 1.0f));
		}
		if ( enter_f == 1 ) {
			printf("\n");
		}
	}

	// テクスチャマップ
	print_bc(geometry_num);
	if ( enter_f == 1 ) {
		printf("\n");
	}
	for ( i = 0; i < geometry_num; i++ ) {
		print_bc(geometry[i]->vertices_size / 3);
		for ( j = 0; j < geometry[i]->vertices_size / 3; j++ ) {
			sprintf(tmp1, "%f", uv[i][j * 2    ]); printf("%s,", f(tmp1, 1.0f));
			sprintf(tmp1, "%f", uv[i][j * 2 + 1]); printf("%s,", f(tmp1, 1.0f));
		}
		if ( enter_f == 1 ) {
			printf("\n");
		}
	}

	// 三角形ストリップ
	double trans_x;
	double trans_y;
	double trans_z;
	double rot_x;
	double rot_y;
	double rot_z;
	double scale_x;
	double scale_y;
	double scale_z;
	print_bc(geometry_num);
	if ( enter_f == 1 ) {
		printf("\n");
	}
	for ( i = 0; i < geometry_num; i++ ) {
		texture_index = -1;
		trans_x = 0.0f;
		trans_y = 0.0f;
		trans_z = 0.0f;
		rot_x = 0.0f;
		rot_y = 0.0f;
		rot_z = 0.0f;
		scale_x = 1.0f;
		scale_y = 1.0f;
		scale_z = 1.0f;
		for ( j = 0; j < conn_geometry_num; j++ ) {
			if ( cmp_conn(conn_geometry[j]->geometry_id, geometry[i]->geometry_id) == 0 ) {
				// Model
				for ( k = 0; k < model_num; k++ ) {
					if ( cmp_conn(model[k]->model_id, conn_geometry[j]->model_id) == 0 ) {
						texture_index = k;
						trans_x = model[k]->trans_x;
						trans_y = model[k]->trans_y;
						trans_z = model[k]->trans_z;
						rot_x = model[k]->rot_x;
						rot_y = model[k]->rot_y;
						rot_z = model[k]->rot_z;
						scale_x = model[k]->scale_x;
						scale_y = model[k]->scale_y;
						scale_z = model[k]->scale_z;
					}
				}
			}
		}

		// geometryごとの平行移動
#if 0
		printf("%f,%f,%f,", trans_x, trans_y, trans_z);
#else
if ( string_f == 1 ) {
		printf(",,,");
} else {
		printf("0,0,0,");
}
#endif
		if ( enter_f == 1 ) {
			printf("\n");
		}

		// geometryごとの回転
#if 0
		if ( rot_x != 0.0f ) {
			printf("%f,1,0,0,", rot_x);
		} else if ( rot_y != 0.0f ) {
			printf("%f,0,1,0,", rot_y);
		} else /*if ( rot_z != 0.0f )*/ {
			printf("%f,0,0,1,", rot_z);
		}
#else
if ( string_f == 1 ) {
		printf(",,,,");
} else {
		printf("0,0,0,0,");
}
#endif
		if ( enter_f == 1 ) {
			printf("\n");
		}

		print_bc(texture_index);	// テクスチャ・インデックス
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

		// strips
		print(strips[i]->size);
		for ( j = 0; j < strips[i]->size; j++ ) {
			print_fc(strips[i]->data[j]);
		}
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

	for ( i = 0; i < geometry_num; i++ ) {
		free(normals[i]);
		free(colors[i]);
		free(uv[i]);
		free_strip(strips[i]);
		free(strips[i]);
	}
	free(normals);
	free(colors);
	free(uv);
	free(strips);

	_free();

	return 0;
}
