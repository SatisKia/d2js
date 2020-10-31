#include "Main.h"

function StageData3(){
	this.MAP = [
		[ 6,2,2,2,2,2,2,2,16,16,28,20,16,16,28,20,16,16,16,16,16,28,28,28,28,28,6,2,28,28,28,28,6,2,28,28,28,28,28,28 ],
		[ 4,0,0,0,0,0,0,0,28,19,28,18,28,19,28,18,28,28,28,28,19,28,28,28,28,28,4,0,28,28,28,28,4,0,28,28,28,28,28,28 ],
		[ 4,0,0,0,0,0,0,0,28,18,28,18,28,18,28,18,28,28,28,28,18,28,28,28,28,28,4,0,28,28,28,28,4,0,28,28,28,28,28,28 ],
		[ 4,0,0,0,0,0,0,0,28,18,28,18,28,18,28,18,28,28,20,16,17,28,28,6,2,2,3,0,1,2,2,2,3,0,1,2,2,28,28,28 ],
		[ 4,0,0,0,0,0,0,0,28,18,28,18,28,18,28,18,28,28,18,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
		[ 4,0,0,0,0,0,0,0,28,18,28,18,28,18,28,18,28,28,18,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
		[ 4,0,0,0,0,0,0,0,28,18,28,18,28,18,28,18,28,28,18,1,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2 ],
		[ 4,0,0,0,0,0,0,0,28,18,15,17,28,18,15,17,28,28,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
		[ 18,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,5,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
		[ 18,28,28,28,20,16,16,28,28,28,20,16,16,16,16,16,28,28,28,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
		[ 18,15,16,16,17,28,19,15,16,16,17,28,28,28,19,14,28,28,28,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
		[ 28,28,28,28,28,28,28,28,28,28,28,28,20,16,17,14,15,16,28,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
		[ 20,16,16,16,16,16,16,16,16,16,16,28,18,28,28,28,28,19,28,28,6,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2 ],
		[ 18,28,28,28,28,28,28,28,28,28,19,28,18,15,16,16,16,17,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
		[ 18,15,16,16,16,28,20,16,16,16,17,28,28,28,19,14,28,28,28,28,28,28,28,5,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
		[ 28,28,28,28,19,28,18,28,28,28,28,28,20,16,17,14,15,16,28,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
		[ 20,16,16,16,17,28,18,15,16,16,16,28,18,28,28,28,28,19,28,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
		[ 18,28,28,28,28,28,28,28,28,28,19,28,18,15,16,16,16,17,28,28,28,28,28,28,28,28,5,0,28,28,28,28,5,0,28,28,28,28,28,28 ],
		[ 18,15,16,16,16,28,20,16,16,16,17,28,28,28,19,14,28,28,28,28,28,28,28,28,28,28,4,0,28,28,28,28,4,0,28,28,28,28,28,28 ],
		[ 28,28,28,28,19,28,18,28,28,28,28,28,20,16,17,14,15,16,28,20,16,16,16,16,28,28,4,0,28,28,28,28,4,0,28,28,20,16,16,16 ],
		[ 20,16,16,16,17,28,18,15,16,16,16,28,18,28,28,28,28,19,28,18,28,28,28,19,28,28,28,28,28,28,28,28,28,28,28,28,18,28,28,19 ],
		[ 18,28,28,28,28,28,28,28,28,28,19,28,18,15,16,16,16,17,28,18,28,28,20,17,28,28,28,28,28,28,28,28,28,28,28,28,18,28,28,18 ],
		[ 18,15,16,16,16,16,16,16,16,28,18,28,28,28,19,14,28,28,28,18,28,28,18,14,15,16,16,16,16,16,16,16,16,16,16,16,17,28,28,18 ],
		[ 28,28,28,28,28,28,28,28,19,28,18,28,28,20,17,14,15,28,28,18,15,28,18,28,28,28,28,28,28,28,28,28,28,28,28,19,14,28,28,18 ],
		[ 20,16,16,16,16,16,16,16,17,28,18,15,16,17,14,14,14,15,16,17,14,28,18,15,16,28,20,16,16,16,16,28,28,28,28,28,19,28,20,17 ],
		[ 18,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,19,28,18,14,14,28,18,28,28,28,19,15,16,28,20,16,17,28,18,28 ],
		[ 18,28,28,20,16,16,16,16,16,16,28,28,28,6,2,2,2,2,2,2,3,28,18,14,14,28,18,15,16,28,18,14,14,28,18,14,14,28,18,28 ],
		[ 18,15,28,18,14,14,14,14,28,19,28,28,28,4,0,0,0,0,0,0,0,28,18,14,14,28,18,14,14,28,18,14,14,28,18,14,14,28,18,28 ],
		[ 18,14,15,17,14,14,14,14,28,18,15,16,28,4,0,0,0,0,0,0,0,28,18,14,14,28,18,14,14,28,18,14,14,28,18,14,14,28,18,28 ],
		[ 18,28,28,28,28,28,28,28,28,18,14,14,28,4,0,0,0,0,0,0,0,28,28,28,19,28,18,14,14,28,18,14,14,28,18,14,14,28,18,15 ],
		[ 18,15,16,16,16,16,16,16,28,18,14,14,28,4,0,0,0,0,0,0,0,28,20,16,17,28,18,14,14,28,28,28,19,15,17,28,28,28,28,19 ],
		[ 28,28,28,28,28,28,28,19,28,18,14,14,28,4,0,0,0,0,0,0,0,28,18,28,28,28,28,28,19,28,28,28,28,28,28,28,28,28,28,18 ],
		[ 6,2,2,2,2,2,2,3,28,18,14,14,28,4,0,0,0,0,0,0,0,28,18,15,16,16,16,28,18,15,16,28,6,2,2,2,2,2,2,3 ],
		[ 4,0,0,0,0,0,0,0,28,28,28,19,28,4,0,0,0,0,0,0,0,28,18,14,14,14,14,28,18,14,14,28,4,0,0,0,0,0,0,0 ],
		[ 4,0,0,0,0,0,0,0,28,20,16,17,28,28,28,28,28,28,28,28,28,28,18,14,14,14,14,28,18,14,14,28,4,0,0,0,0,0,0,0 ],
		[ 4,0,0,0,0,0,0,0,28,18,28,28,28,28,28,20,16,16,16,16,28,28,28,28,28,28,19,28,18,14,14,28,4,0,0,0,0,0,0,0 ],
		[ 4,0,0,0,0,0,0,0,28,18,15,16,16,16,28,18,28,28,28,19,15,16,16,16,16,16,17,28,18,14,14,28,4,0,0,0,0,0,0,0 ],
		[ 4,0,0,0,0,0,0,0,28,18,14,14,14,14,28,18,15,16,28,18,14,28,28,28,28,28,28,28,28,28,19,28,4,0,0,0,0,0,0,0 ],
		[ 4,0,0,0,0,0,0,0,28,18,14,14,14,14,28,28,28,19,28,18,14,28,28,28,20,16,16,16,16,28,18,28,4,0,0,0,0,0,0,0 ],
		[ 4,0,0,0,0,0,0,0,28,28,28,28,28,19,15,16,16,17,28,18,14,15,16,16,17,28,28,28,19,15,17,28,4,0,0,0,0,0,0,0 ]
	];
	this.ENEMY = [
		[ E_ALL,9,0,4,80,0,1 ],
		[ E_ALL,11,0,4,80,0,1 ],
		[ E_ALL,13,0,4,80,0,1 ],
		[ E_ALL,15,0,4,80,0,1 ],
		[ E_ALL,0,14,6,80,0,1 ],
		[ E_ALL,0,16,6,80,0,1 ],
		[ E_ALL,0,18,6,80,0,1 ],
		[ E_ALL,0,20,6,80,0,1 ],
		[ E_ALL,6,14,6,80,0,1 ],
		[ E_ALL,6,16,6,80,0,1 ],
		[ E_ALL,6,18,6,80,0,1 ],
		[ E_ALL,6,20,6,80,0,1 ],
		[ E_ALL,0,10,6,80,20,1 ],
		[ E_ALL,0,30,6,80,20,1 ],
		[ E_ALL,10,24,6,80,20,1 ],
		[ E_ALL,19,19,4,80,20,1 ],
		[ E_ALL,38,24,4,80,20,1 ],
		[ E_ALL,12,12,8,80,0,2 ],
		[ E_ALL,17,16,8,80,0,2 ],
		[ E_ALL,12,20,8,80,0,2 ],
		[ E_ALL,5,27,8,80,0,2 ],
		[ E_ALL,10,30,8,80,0,2 ],
		[ E_ALL,11,37,8,80,0,2 ],
		[ E_ALL,23,26,8,80,0,2 ],
		[ E_ALL,24,33,8,80,0,2 ],
		[ E_ALL,27,28,8,80,0,2 ],
		[ E_ALL,29,34,8,80,0,2 ],
		[ E_ALL,31,27,8,80,0,2 ],
		[ E_ALL,35,27,8,80,0,2 ],
		[ E_ALL,3,3,20,80,0,2 ],
		[ E_ALL,4,35,20,80,0,2 ],
		[ E_ALL,17,29,20,80,0,2 ],
		[ E_ALL,36,35,20,80,0,2 ],
		[ E_ALL,26,1,12,120,30,15 ],
		[ E_ALL,27,1,12,120,30,15 ],
		[ E_ALL,32,1,12,120,30,15 ],
		[ E_ALL,33,1,12,120,30,15 ],
		[ E_ALL,38,6,13,120,30,15 ],
		[ E_ALL,38,7,13,120,30,15 ],
		[ E_ALL,38,12,13,120,30,15 ],
		[ E_ALL,38,13,13,120,30,15 ],
		[ E_ALL,33,18,15,120,30,15 ],
		[ E_ALL,32,18,15,120,30,15 ],
		[ E_ALL,27,18,15,120,30,15 ],
		[ E_ALL,26,18,15,120,30,15 ],
		[ E_ALL,21,13,14,120,30,15 ],
		[ E_ALL,21,12,14,120,30,15 ],
		[ E_ALL,26,0,8,120,60,15 ],
		[ E_ALL,27,0,8,120,60,15 ],
		[ E_ALL,32,0,8,120,60,15 ],
		[ E_ALL,33,0,8,120,60,15 ],
		[ E_ALL,39,6,9,120,60,15 ],
		[ E_ALL,39,7,9,120,60,15 ],
		[ E_ALL,39,12,9,120,60,15 ],
		[ E_ALL,39,13,9,120,60,15 ],
		[ E_ALL,33,19,11,120,60,15 ],
		[ E_ALL,32,19,11,120,60,15 ],
		[ E_ALL,27,19,11,120,60,15 ],
		[ E_ALL,26,19,11,120,60,15 ],
		[ E_ALL,20,13,10,120,60,15 ],
		[ E_ALL,20,12,10,120,60,15 ],
		[ E_ALL,4,4,3,80,0,4 ],
		[ E_ALL,3,36,3,80,0,4 ],
		[ E_ALL,16,30,3,80,0,4 ],
		[ E_ALL,35,36,3,80,0,4 ],
		[ E_EASY,26,2,0,180,0,1 ],
		[ E_EASY,27,2,0,180,30,1 ],
		[ E_EASY,32,2,1,180,60,1 ],
		[ E_EASY,33,2,1,180,90,1 ],
		[ E_EASY,37,6,2,180,120,1 ],
		[ E_EASY,37,7,2,180,150,1 ],
		[ E_EASY,37,12,0,180,0,1 ],
		[ E_EASY,37,13,0,180,30,1 ],
		[ E_EASY,33,17,1,180,60,1 ],
		[ E_EASY,32,17,1,180,90,1 ],
		[ E_EASY,27,17,2,180,120,1 ],
		[ E_EASY,26,17,2,180,150,1 ],
		[ E_EASY,22,13,0,180,0,1 ],
		[ E_EASY,22,12,0,180,30,1 ],
		[ E_EASY,22,7,1,180,60,1 ],
		[ E_EASY,22,6,1,180,90,1 ],
		[ E_HARD,26,2,0,180,0,1 ],
		[ E_HARD,27,2,0,180,30,1 ],
		[ E_HARD,32,2,1,180,60,1 ],
		[ E_HARD,33,2,1,180,90,1 ],
		[ E_HARD,37,6,2,180,120,1 ],
		[ E_HARD,37,7,2,180,150,1 ],
		[ E_HARD,37,12,0,180,0,1 ],
		[ E_HARD,37,13,0,180,30,1 ],
		[ E_HARD,33,17,1,180,60,1 ],
		[ E_HARD,32,17,1,180,90,1 ],
		[ E_HARD,27,17,2,180,120,1 ],
		[ E_HARD,26,17,2,180,150,1 ],
		[ E_HARD,22,13,0,180,0,1 ],
		[ E_HARD,22,12,0,180,30,1 ],
		[ E_HARD,22,7,1,180,60,1 ],
		[ E_HARD,22,6,1,180,90,1 ],
		[ E_END,0,0,0,0,0,0 ]
	];
}
