#define USE_WAVEDRAWDATA
#define WAVE_FULLTIME

// ステージ数
#define STAGE_NUM		6

// ベースの種類
#define BASE_NORMAL		0
#define BASE_SLOW		1
#define BASE_INERTIA	2
#define BASE_GUARDRAIL	3
#define BASE_KABE		4

// 方向
#define DIRECTION_D		0
#define DIRECTION_L		1
#define DIRECTION_R		2
#define DIRECTION_U		3
#define DIRECTION_LD	4
#define DIRECTION_LU	5
#define DIRECTION_RD	6
#define DIRECTION_RU	7

// 敵の種類
#define ENEMY_0			0
#define ENEMY_1			1
#define ENEMY_2			2
#define ENEMY_3			3
#define ENEMY_4			4
#define ENEMY_5			5
#define ENEMY_6			6

// 敵の攻撃の種類
#define RING_C			0
#define RING_M			1
#define RING_Y			2
#define RING_RANDOM		3
#define SHOT_DIRECTION	4
#define SHOT_TARGET		5
#define SHOT_CIRCLE		6
#define TOUCH			7

// 自機のライフ
#define JIKI_LIFE		10

// アプリの状態
#define STATE_LAUNCH	-1
#define STATE_TITLE		0
#define STATE_READY		2
#define STATE_PLAY		3
#define STATE_CLEAR		4
#define STATE_GAMEOVER	5

// 待ちフレーム数
#define WAIT_Q			3
#define WAIT_1			15
#define WAIT_2			30
#define WAIT_4			60

// 爆発に関する各種フレーム数
#define BAKU_FRAME		4
#define BAKU_LAG1		2
#define BAKU_LAG2		4
#define BAKU_LAG3		6

// リングに関する各種フレーム数
#define RING_FRAME		4

// 各種移動量
#define ENEMY_MOVE1		2
#define ENEMY_MOVE2		4
#define ENEMY_MOVE3		6
#define SHOT_MOVE		6
#define JIKI_MOVE1		4
#define JIKI_MOVE2		8

//
#define E_END			-1
#define E_ALL			0
#define E_EASY			1
#define E_HARD			2

//
#define SE_CURSOR		0
#define SE_SELECT		1
#define SE_BAKU_S		2
#define SE_BAKU_L		3
#define SE_WAVE			4
#define SE_SHOT			5
#define SE_LASER		6
#define SE_DAMAGE		7
#define SE_MOVE			8
#define SE_NUM			9

#include "_Global.h"
