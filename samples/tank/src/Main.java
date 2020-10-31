/************************************************
 * T A N K  B A R R I E R  2                    *
 * Copyright (C) SatisKia. All rights reserved. *
 ************************************************
 * ADF設定                                      *
 * AppClass  ：Main                             *
 * AppName   ：TANK BARRIER 2                   *
 * SPsize    ：1024                             *
 ************************************************/

import com.nttdocomo.ui.*;
import javax.microedition.io.*;
import java.io.*;
import java.lang.*;
import java.util.*;

// ストリーム読み込みブロックサイズ
#define DATA_SIZE		256

// ステージ数
#define STAGE_NUM		6

// フォントの種類
#define FONT_TINY		0
#define FONT_SMALL		1
#define FONT_MEDIUM		2

// 画像の種類
#define IMAGE_BAKU		0
#define IMAGE_ENEMY		1
#define IMAGE_LIGHT		2
#define IMAGE_ENEMY_D	3

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
#define STATE_HELP		1
#define STATE_READY		2
#define STATE_PLAY		3
#define STATE_CLEAR		4
#define STATE_GAMEOVER	5

// 1フレームの時間(ミリ秒)
#define FRAME_TIME		80

// 待ちフレーム数
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

/**
 * メイン
 */
public class Main extends IApplication {
	public static MainCanvas canvas;
	public static Graphics g;

	public static Random rand;
	public static Stage stage;
	public static Wave wave;
	public static Shots shots;
	public static Jiki jiki;

	// よく使う色
	public static final int COLOR_C = Graphics.getColorOfRGB(   0, 255, 255 );
	public static final int COLOR_M = Graphics.getColorOfRGB( 255,   0, 255 );
	public static final int COLOR_Y = Graphics.getColorOfRGB( 255, 255,   0 );
	public static final int COLOR_K = Graphics.getColorOfRGB(   0,   0,   0 );
	public static final int COLOR_R = Graphics.getColorOfRGB( 255,   0,   0 );
	public static final int COLOR_G = Graphics.getColorOfRGB(   0, 255,   0 );
	public static final int COLOR_W = Graphics.getColorOfRGB( 255, 255, 255 );

	// よく使うフォント
	public static Font[] font;

	// 三角関数テーブル
	public static final int[] COS = { 1358, 1176, 679, 0, -678, -1176, -1358, -1176, -679, 0, 679, 1176 };
	public static final int[] SIN = { 0, 678, 1176, 1358, 1176, 678, 0, -679, -1176, -1358, -1176, -679 };

	// ブースト判定用
	public static final int BOOST =
		(1 << Display.KEY_SOFT1   ) |
		(1 << Display.KEY_4       ) |
		(1 << Display.KEY_7       ) |
		(1 << Display.KEY_ASTERISK) |
		(1 << Display.KEY_SELECT  ) |
		(1 << Display.KEY_5       ) |
		(1 << Display.KEY_8       ) |
		(1 << Display.KEY_0       ) |
		(1 << Display.KEY_SOFT2   ) |
		(1 << Display.KEY_6       ) |
		(1 << Display.KEY_9       ) |
		(1 << Display.KEY_POUND   )
		;

	public static final int[][] ENEMY_Y = {
		{   0,  32,  58,  92, 118, 150, 184 },
		{   0, 210, 236, 270, 118, 150, 184 }
	};

	int state = STATE_LAUNCH;	// アプリの状態
	int help;					// ヘルプの種類
	int _elapse;				// 経過時間
	int _elapse_p;				// ポーズ中の経過時間
	boolean pause = false;		// ポーズ中かどうか
	boolean boost = false;		// ブースト中かどうか
	boolean map = true;			// マップを表示するかどうか
	int quake = 0;				// 振動の残り時間
	int quake_x, quake_y;		// 振動の移動量

	int height;
	int origin_x, origin_y;

	int st_index;				// ステージ番号
	int[] st_max;				// 選択可能なステージの最大
	int level;					// レベル
	int level_max;				// レベルの最大

	int score = 0, hi_score;	// スコア
	int bonus = 0;				// ボーナス

	int old_score;				// ステージ開始時のスコア
	int bonus_d;				// ボーナス表示用
	int[][] best_s;				// ベストスコア
	int new_s;					// 今回のスコア
	boolean new_score;			// スコア更新かどうか

	int old_life;				// ステージ開始時の自機のライフ
	int miss;					// ステージ中に受けたダメージ数
	int[][] best_t;				// ベストタイム
	int new_t;					// 今回のタイム
	boolean new_record;			// 記録更新かどうか

	MediaImage m_mimg;			// マスクイメージ
	Image m_img = null;			// マスクイメージ

	boolean dark;				// 闇ステージかどうか

	int key = 0;

	// キー入力と描画との排他処理用
	boolean _lock_state = false;
	boolean _wait_state = false;
	public void lock_state(){
		_wait_state = true;
		while( _lock_state ){
			try {
				Thread.sleep( FRAME_TIME );
			} catch( Exception e ){
			}
		}
		_lock_state = true;
		_wait_state = false;
	}
	public void unlock_state(){
		_lock_state = false;
		while( _wait_state ){
			try {
				Thread.sleep( FRAME_TIME );
			} catch( Exception e ){
			}
		}
	}

	// キー入力時処理のコンフリクト抑制用
	boolean processingEvent = false;

	/**
	 * 設定の読み込み
	 */
	public void load_config(){
		int i;

		// デフォルト値
		st_index  = 0;
		hi_score  = 68000;
		st_max[0] = 0;
		st_max[1] = 0;
		st_max[2] = 0;
		st_max[3] = 0;
		st_max[4] = 0;
		st_max[5] = 0;
		st_max[6] = 0;
		st_max[7] = 0;
		level     = 0;
		level_max = 0;
		for( i = 0; i < STAGE_NUM; i++ ){
			best_s[0][i] = 0;
			best_s[1][i] = 0;
			best_s[2][i] = 0;
			best_s[3][i] = 0;
			best_s[4][i] = 0;
			best_s[5][i] = 0;
			best_s[6][i] = 0;
			best_s[7][i] = 0;
			best_t[0][i] = 99999;
			best_t[1][i] = 99999;
			best_t[2][i] = 99999;
			best_t[3][i] = 99999;
			best_t[4][i] = 99999;
			best_t[5][i] = 99999;
			best_t[6][i] = 99999;
			best_t[7][i] = 99999;
		}

		try {
			InputStream tmp;

			// スクラッチパッドに既にデータがあるかどうかチェックする
			int size = -1;
			tmp = Connector.openInputStream( "scratchpad:///0;pos=0" );
			try {
				size = tmp.read();
			} catch( Exception e ){
			}
			tmp.close();

			// データがあるので読み出す
			if( size > 0 ){
				tmp = Connector.openInputStream( "scratchpad:///0;pos=0" );
				StreamReader reader = new StreamReader();
				reader.begin( tmp );
				String str = new String( "" );
				str = reader.read(); if( str.length() > 0 ) st_index  = Integer.parseInt( str );
				str = reader.read(); if( str.length() > 0 ) hi_score  = Integer.parseInt( str );
				str = reader.read(); if( str.length() > 0 ) st_max[0] = Integer.parseInt( str );
				str = reader.read(); if( str.length() > 0 ) level     = Integer.parseInt( str );
				str = reader.read(); if( str.length() > 0 ) level_max = Integer.parseInt( str );
				str = reader.read(); if( str.length() > 0 ) st_max[1] = Integer.parseInt( str );
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_s[0][i] = Integer.parseInt( str );
				}
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_s[1][i] = Integer.parseInt( str );
				}
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_t[0][i] = Integer.parseInt( str );
				}
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_t[1][i] = Integer.parseInt( str );
				}
				str = reader.read(); if( str.length() > 0 ) st_max[2] = Integer.parseInt( str );
				str = reader.read(); if( str.length() > 0 ) st_max[3] = Integer.parseInt( str );
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_s[2][i] = Integer.parseInt( str );
				}
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_s[3][i] = Integer.parseInt( str );
				}
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_t[2][i] = Integer.parseInt( str );
				}
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_t[3][i] = Integer.parseInt( str );
				}
				str = reader.read(); if( str.length() > 0 ) st_max[4] = Integer.parseInt( str );
				str = reader.read(); if( str.length() > 0 ) st_max[5] = Integer.parseInt( str );
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_s[4][i] = Integer.parseInt( str );
				}
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_s[5][i] = Integer.parseInt( str );
				}
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_t[4][i] = Integer.parseInt( str );
				}
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_t[5][i] = Integer.parseInt( str );
				}
				str = reader.read(); if( str.length() > 0 ) st_max[6] = Integer.parseInt( str );
				str = reader.read(); if( str.length() > 0 ) st_max[7] = Integer.parseInt( str );
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_s[6][i] = Integer.parseInt( str );
				}
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_s[7][i] = Integer.parseInt( str );
				}
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_t[6][i] = Integer.parseInt( str );
				}
				for( i = 0; i < STAGE_NUM; i++ ){
					str = reader.read(); if( str.length() > 0 ) best_t[7][i] = Integer.parseInt( str );
				}
				reader.end();
				tmp.close();
			}
		} catch( Exception e ){
e.printStackTrace();
		}

		// レベル最大値を設定する
		if( best_s[0][STAGE_NUM - 1] != 0 ) level_max = 1;
		if( best_s[1][STAGE_NUM - 1] != 0 ) level_max = 2;
		if( best_s[2][STAGE_NUM - 1] != 0 ) level_max = 3;
		if( best_s[3][STAGE_NUM - 1] != 0 ) level_max = 4;
		if( best_s[4][STAGE_NUM - 1] != 0 ) level_max = 5;
		if( best_s[5][STAGE_NUM - 1] != 0 ) level_max = 6;
		if( best_s[6][STAGE_NUM - 1] != 0 ) level_max = 7;
	}

	/**
	 * 設定の書き出し
	 */
	public void save_config(){
		int i;
		String str = new String( "" );
		str = "" +
			st_index  + "," +
			hi_score  + "," +
			st_max[0] + "," +
			level     + "," +
			level_max + "," +
			st_max[1] + ",";
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_s[0][i] + ",";
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_s[1][i] + ",";
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_t[0][i] + ",";
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_t[1][i] + ",";
		}
		str = str +
			st_max[2] + "," +
			st_max[3] + ",";
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_s[2][i] + ",";
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_s[3][i] + ",";
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_t[2][i] + ",";
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_t[3][i] + ",";
		}
		str = str +
			st_max[4] + "," +
			st_max[5] + ",";
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_s[4][i] + ",";
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_s[5][i] + ",";
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_t[4][i] + ",";
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_t[5][i] + ",";
		}
		str = str +
			st_max[6] + "," +
			st_max[7] + ",";
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_s[6][i] + ",";
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_s[7][i] + ",";
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_t[6][i] + ",";
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = str + best_t[7][i] + ",";
		}
		byte[] data = str.getBytes();
		try {
			DataOutputStream out = Connector.openDataOutputStream( "scratchpad:///0;pos=0" );
			out.write( data, 0, data.length );
			out.close();
		} catch( Exception e ){
		}
	}

	// 経過時間を確認する
	public int elapse(){ return pause ? _elapse_p : _elapse; }

	/**
	 * マスクイメージ読み込み
	 */
	public void create_mask(){
		if( m_img == null ){
			try {
				m_mimg = MediaManager.getImage( "resource:///mask.gif" );
				m_mimg.use();
				m_img = m_mimg.getImage();
			} catch( Exception e ){
			}
		}
	}

	/**
	 * マスクイメージ解放
	 */
	public void dispose_mask(){
		if( m_img != null ){
			m_img.dispose();
			m_mimg.dispose();
			m_img = null;
			System.gc();
		}
	}

	/**
	 * アプリの状態を変更する
	 */
	public void set_state( int new_state ){
		int old_state = state;
		state = new_state;
		_elapse = 0;
		boost = false;

		switch( old_state ){
		case STATE_TITLE:
			if( state != STATE_HELP ){
				dispose_mask();
			}
			if( state == STATE_READY ){
				score = 0;
				bonus = 0;
				jiki.init( true );
			}
			break;
		case STATE_CLEAR:
			add_score( bonus ); bonus = 0;
			if( state != STATE_TITLE ){
				jiki.init( false );
			}
			st_index++; if( st_index > st_max[level] ) st_max[level] = st_index;
			save_config();
			break;
		}

		switch( state ){
		case STATE_TITLE:
			create_mask();
			if( old_state != STATE_HELP ){
				pause = false;
				if( st_index >= STAGE_NUM ) new_level();
				save_config();
			}
			canvas.setSoftLabel( Frame.SOFT_KEY_1, "HELP" );
			canvas.setSoftLabel( Frame.SOFT_KEY_2, "EXIT" );
			quake = 0;
			break;
		case STATE_HELP:
			canvas.setSoftLabel( Frame.SOFT_KEY_1, "TITLE" );
			canvas.setSoftLabel( Frame.SOFT_KEY_2, "EXIT" );
			help = 0;
			break;
		case STATE_READY:
			canvas.setSoftLabel( Frame.SOFT_KEY_1, "" );
			canvas.setSoftLabel( Frame.SOFT_KEY_2, "" );
			map = true;
			old_life = jiki.life();
			old_score = score;
			bonus = 6800;
			stage.create();
			wave.create();
			shots.create();
			break;
		case STATE_CLEAR:
			bonus_d = bonus;
			new_s = (score + bonus_d) - old_score;
			if( new_s > best_s[level][st_index] ){
				new_score = (best_s[level][st_index] == 0) ? false : true;
				best_s[level][st_index] = new_s;
			} else {
				new_score = false;
			}
			miss = jiki.life() - old_life;
			new_t = (6800 - bonus_d) + 680 * miss;
			if( new_t < best_t[level][st_index] ){
				new_record = (best_t[level][st_index] == 99999) ? false : true;
				best_t[level][st_index] = new_t;
			} else {
				new_record = false;
			}
			break;
		}
	}

	/**
	 * 描画に使用する色を設定
	 */
	public void setCMYColor( int col ){
		switch( col ){
		case 0: g.setColor( COLOR_C ); break;
		case 1: g.setColor( COLOR_M ); break;
		case 2: g.setColor( COLOR_Y ); break;
		}
	}

	int stringWidth( int type, String str ){
		return font[type].stringWidth( str );
	}
	int fontHeight( int type ){
		return font[type].getHeight();
	}
	void drawImage( Graphics g, Image img, int x0, int y0, int x, int y, int w, int h ){
		g.drawImage( img, x0, y0, x, y, w, h );
	}
	void drawImage( Graphics g, Image img, int x0, int y0 ){
		g.drawImage( img, x0, y0 );
	}

	/**
	 * ウィンドウに対応した各種描画
	 */
	void setOrigin( int x, int y ){
		g.setOrigin( x, y );
	}
	void clearClip(){
		g.clearClip();
	}
	void setClip( int x, int y, int w, int h ){
		g.setClip( x, y, w, h );
	}
	boolean drawImage( Image img, int x0, int y0, int x, int y, int w, int h ){
		x0 -= stage.win_x();
		y0 -= stage.win_y();
		if( (x0 + w > 0) && (x0 < 216) && (y0 + h > 0) && (y0 < 216) ){
			drawImage( g, img, x0, y0, x, y, w, h );
			return true;
		}
		return false;
	}
	boolean drawImage( Image img, int x0, int y0, int w, int h ){
		x0 -= stage.win_x();
		y0 -= stage.win_y();
		if( (x0 + w > 0) && (x0 < 216) && (y0 + h > 0) && (y0 < 216) ){
			drawImage( g, img, x0, y0 );
			return true;
		}
		return false;
	}
	void drawLine( int x0, int y0, int x1, int y1 ){
		x0 -= stage.win_x();
		y0 -= stage.win_y();
		x1 -= stage.win_x();
		y1 -= stage.win_y();
		if(
			((x0 > 0) && (x0 < 216) && (y0 > 0) && (y0 < 216)) ||
			((x1 > 0) && (x1 < 216) && (y1 > 0) && (y1 < 216))
		){
			g.drawLine( x0, y0, x1, y1 );
		}
	}
	void drawRect( int x, int y, int w, int h ){
		x -= stage.win_x();
		y -= stage.win_y();
		if( (x + w > 0) && (x < 216) && (y + h > 0) && (y < 216) ){
			g.drawRect( x, y, w, h );
		}
	}
	void fillRect( int x, int y, int w, int h ){
		x -= stage.win_x();
		y -= stage.win_y();
		if( (x + w > 0) && (x < 216) && (y + h > 0) && (y < 216) ){
			g.fillRect( x, y, w, h );
		}
	}

	/**
	 * start
	 */
	public void start(){
		// よく使うフォント
		font = new Font[3];
		font[FONT_TINY  ] = Font.getFont( Font.FACE_SYSTEM | Font.STYLE_PLAIN | Font.SIZE_TINY   );
		font[FONT_SMALL ] = Font.getFont( Font.FACE_SYSTEM | Font.STYLE_PLAIN | Font.SIZE_SMALL  );
		font[FONT_MEDIUM] = Font.getFont( Font.FACE_SYSTEM | Font.STYLE_PLAIN | Font.SIZE_MEDIUM );

		origin_x = 0;
		origin_y = 0;

		canvas = new MainCanvas();
		height = canvas.getHeight();

		{
			lock_state();
			set_state( STATE_LAUNCH );
			unlock_state();

			Display.setCurrent( canvas );

			// スレッドでの描画開始
			DrawThread runner = new DrawThread();
			runner.start();

			st_max = new int[8];
			best_s = new int[8][STAGE_NUM];
			best_t = new int[8][STAGE_NUM];

			rand = new Random( System.currentTimeMillis() );
			stage = new Stage();
			wave = new Wave();
			shots = new Shots();
			jiki = new Jiki();

			load_config();

			stage.create();

			// スレッドでの描画終了
			runner.end();
			try {
				runner.join();
			} catch( Exception e ){
			}
		}

		lock_state();
		set_state( STATE_TITLE );
		unlock_state();

		long start_time;
		long sleep_time;
		while( true ){
			start_time = System.currentTimeMillis();
			canvas.paint( g );
			sleep_time = FRAME_TIME - (System.currentTimeMillis() - start_time);
			if( sleep_time > 0 ){
				try {
					Thread.sleep( sleep_time );
				} catch( Exception e ){
				}
			}
		}
	}

	// スコア加算
	public void add_score( int point ){ score += point; if( score > hi_score ) hi_score = score; }
	public void add_bonus( int point ){ add_score( point ); bonus -= point; }

	// ステージ番号を直す
	public void stage_update(){ if( st_index > st_max[level] ) st_index = st_max[level]; }

	/**
	 * レベルを上げる
	 */
	public void new_level(){
		level++; if( level > 7 ) level = 0;
		if( level > level_max ) level_max = level;
		st_index = 0;
	}

	/**
	 * 描画をスレッドで行うクラス
	 */
	class DrawThread extends Thread {
		private boolean _run = true;
		public void run(){
			while( _run ){
				canvas.repaint();
				try {
					Thread.sleep( FRAME_TIME );
				} catch( Exception e ){
				}
			}
		}
		public void end(){ _run = false; }
	}

	/**
	 * ストリームからコンマ区切りの文字列を読み出すクラス
	 */
	class StreamReader {
		char[] data;
		int data_size;
		int data_index;
		char[] word;
		InputStreamReader reader;
		StreamReader(){
			data = new char[DATA_SIZE];
			word = new char[16];
		}
		public void begin( InputStream in ){
			reader = new InputStreamReader( in );
			begin();
		}
		public void end(){
			try {
				reader.close();
			} catch( IOException e ){
			}
		}
		private int begin(){
			try {
				data_size = reader.read( data, 0, DATA_SIZE );
			} catch( IOException e ){
			}
			data_index = 0;
			return data_size;
		}
		private int read_chr(){
			if( data_index >= data_size ){
				if( begin() <= 0 ) return -1;
			}
			int chr = data[data_index];
			data_index++;
			return chr;
		}
		public String read(){
			int wordIndex = 0;
			try {
				int chr = 0;

				// 現在位置が既に改行コードの場合に読み飛ばす
				while( true ){
					chr = read_chr();
					if( chr <= 0 ) break;
					if( (chr != '\r') && (chr != '\n') ){
						if( chr != ' ' ){
							word[wordIndex] = (char)chr;
							wordIndex++;
						}
						break;
					}
				}
				if( chr != ',' ){
					while( true ){
						chr = read_chr();
						if( (chr <= 0) || (chr == ',') || (chr == '\r') || (chr == '\n') ) break;
						if( chr != ' ' ){
							word[wordIndex] = (char)chr;
							wordIndex++;
						}
					}
				}
			} catch( Exception e ){
			}
			String str = new String( word, 0, wordIndex );
			return str;
		}
		public int read_val(){
			return Integer.parseInt( read() );
		}
	}

	/**
	 * キャンバス
	 */
	class MainCanvas extends Canvas {
		/**
		 * コンストラクタ
		 */
		MainCanvas(){
			PhoneSystem.setAttribute(
				PhoneSystem.DEV_BACKLIGHT,
				PhoneSystem.ATTR_BACKLIGHT_ON
				);
			setSoftLabel( Frame.SOFT_KEY_1, "" );
			setSoftLabel( Frame.SOFT_KEY_2, "" );

			g = getGraphics();
		}

		/**
		 * 文字列描画
		 */
		private void drawString( String str, int x, int y ){
			g.drawString( str, x    , y );
			g.drawString( str, x + 1, y );
		}

		/**
		 * 文字列センタリング描画
		 */
		private void centerDrawString( String str, int type, int y ){
			g.setFont( font[type] );
			drawString( str,
				(240 - stringWidth( type, str )) / 2,
				y + fontHeight( type ) / 2
				);
		}

		/**
		 * 文字列折り返し描画
		 */
		private int drawStringTurn( String str, int x, int y, int width ){
			int len = str.length();
			char data[] = new char[len];
			str.getChars( 0, len, data, 0 );
			int start = 0;
			int end = 0;
			int h = font[FONT_SMALL].getHeight();
			boolean line_break;
			while( len > 0 ){
				end = font[FONT_SMALL].getLineBreak( str, start, len, width );

				// 行頭禁則
				line_break = false;
				while( true ){
					if( end < str.length() ){
						switch( str.charAt( end ) ){
						case '!':
						case ')':
						case ',':
						case '.':
						case 'ﾞ':
						case 'ﾟ':
							end++;
							break;
						default:
							line_break = true;
							break;
						}
					} else {
						line_break = true;
					}
					if( line_break ){
						break;
					}
				}

				// 行末禁則
				line_break = false;
				while( true ){
					if( end > (start + 1) ){
						switch( str.charAt( end - 1 ) ){
						case '(':
							end--;
							break;
						default:
							line_break = true;
							break;
						}
					} else {
						line_break = true;
					}
					if( line_break ){
						break;
					}
				}

				g.drawChars( data, x, y, start, end - start );
				len -= (end - start);
				start = end;
				y += h;
			}
			return y;
		}

		private void drawStatus( String str, int x, int y ){
			drawString( str, x - stringWidth( FONT_SMALL, str ), y );
		}

		private void drawHelpTitle( String str, int x, int y ){
			g.drawString( str, x - stringWidth( FONT_SMALL, str ), y );
		}

		private int drawHelpButton( String str, int x, int y ){
			int w = stringWidth( FONT_SMALL, str );
			int h = fontHeight( FONT_SMALL );
			g.drawRect( x, y - h - 2, w + 6, h + 4 );
			g.drawString( str, x + 3, y );
			return x + w + 6;
		}

		/**
		 * ステージ描画
		 */
		private void drawStage( boolean title ){
			g.setColor( COLOR_K );
			g.fillRect( 0, 0, 240, height );
			setOrigin( 12, 12 );
			setClip( 0, 0, 216, 216 );
			stage.draw( title );
		}

		/**
		 * ステータス描画
		 */
		private void drawStatus( boolean title ){
			int y, y2, h, h2;

			clearClip();
			if( quake > 0 ){
				setOrigin( quake_x, quake_y );
			} else {
				setOrigin( 0, 0 );
			}

			if( height >= 265 ){
				y = 240;
				h = height - y;
			} else if( title ){
				// 上部固定
				y = 0;
				h = 25;
			} else {
				h = 25;
				y = ((jiki.y() - stage.win_y()) < (height / 2 - 24)) ? (height - 25) : 0;
			}

			// スコア
			int h3 = fontHeight( FONT_SMALL );
			y2 = (y == 0) ? h : y + h3;
			g.setFont( font[FONT_SMALL] );
			g.setColor( COLOR_W );
			drawString( (h3 > 16) ? "SC" : "SCORE", 0, y2 );
			drawStatus( "" + score, 100, y2 );
			g.setColor( COLOR_M );
			drawString( "HI", 106, y2 );
			drawStatus( "" + hi_score, 184, y2 );
			g.setColor( boost ? COLOR_Y : COLOR_W );
			drawString( "T", 190, y2 );
			drawStatus( "" + bonus, 239, y2 );

			// ダメージ
			if( y == 0 ){
				y2 = 0;
				h2 = h - h3;
			} else {
				y2 = h3;
				h2 = h - y2;
			}
			int w = 240 * jiki.total_damage() / jiki.max_damage();
			if     ( w < 100 ) g.setColor( COLOR_G );
			else if( w < 200 ) g.setColor( COLOR_Y );
			else               g.setColor( COLOR_R );
			g.fillRect( 0, y + y2, w, h2 );
			g.drawRect( 0, y + y2, 239, h2 - 1 );

			// マップ
			if( !title && map ){
				int map_x, map_y;
				map_x = ((jiki.x() - stage.win_x()) < 96) ? (240 - 64) : 0;
				if( y == 0 ){
					map_y = h;
				} else if( y == 240 ){
					map_y = ((jiki.y() - stage.win_y()) < 96) ? (240 - 64) : 0;
				} else {
					map_y = y - 64;
				}
				stage.draw_map( map_x, map_y );
			}

			if( quake > 0 ){
				setOrigin( 0, 0 );
			}
		}

		/**
		 * paint
		 */
		public void paint( Graphics _g ){
			lock_state();

			key = canvas.getKeypadState();

			if( !pause ){
				if( quake > 0 ){
					quake_x = rand.nextInt() % ((quake + 2) / 3);
					quake_y = rand.nextInt() % ((quake + 2) / 3);
				}
			}

			switch( state ){
			case STATE_LAUNCH:
				g.lock();
				g.setColor( COLOR_K );
				g.fillRect( 0, 0, 240, height );
				setCMYColor( _elapse % 3 );
				centerDrawString( "起動中...", FONT_SMALL, 120 );
				g.unlock( true );
				break;
			case STATE_TITLE:
				// 描画
				g.lock();
				drawStage( true );
				if( m_img != null ){
					drawImage( g, m_img, origin_x, origin_y );
				}
				drawStatus( true );
				setCMYColor( _elapse % 3 );
				centerDrawString( "TANK BARRIER 2", FONT_MEDIUM, 50 );
				switch( level ){
				case 0:
				case 1:
					g.setColor( COLOR_W );
					break;
				case 2:
				case 3:
					g.setColor( COLOR_C );
					break;
				case 4:
				case 5:
					g.setColor( COLOR_M );
					break;
				case 6:
				case 7:
					g.setColor( COLOR_Y );
					break;
				}
				if( (level % 2) == 0 ){
					centerDrawString( "LEVEL EASY", FONT_SMALL, 90 );
				} else {
					centerDrawString( "LEVEL HARD", FONT_SMALL, 90 );
				}
				centerDrawString(
					"STAGE " + ((st_index < 9) ? "0" : "") + (st_index + 1),
					FONT_SMALL,
					115
					);
				g.setColor( COLOR_Y );
				drawString( "BEST SCORE ", 145 - stringWidth( FONT_SMALL, "BEST SCORE " ), 150 );
				if( best_s[level][st_index] == 0 ){
					drawString( "---", 145, 150 );
				} else {
					drawString(
						"" + best_s[level][st_index],
						145,
						150
						);
				}
				drawString( "BEST TIME ", 145 - stringWidth( FONT_SMALL, "BEST TIME " ), 170 );
				if( best_t[level][st_index] == 99999 ){
					drawString( "---", 145, 170 );
				} else {
					drawString(
						"" + best_t[level][st_index],
						145,
						170
						);
				}
				g.setColor( COLOR_W );
				if( (key & (1 << Display.KEY_SELECT)) != 0 ){
					centerDrawString( "LOADING...", FONT_SMALL, 190 );
				} else {
					if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
						centerDrawString( "PRESS SELECT KEY", FONT_SMALL, 190 );
					}
				}
				centerDrawString( "COPYRIGHT (C) SatisKia", FONT_TINY, 220 );
				g.unlock( true );

				// キーが押されたらゲームモードへ
				if( (key & (1 << Display.KEY_SELECT)) != 0 ){
					set_state( STATE_READY );
				}

				break;
			case STATE_HELP:
				// 描画
				g.lock();
				drawStage( true );
				if( m_img != null ){
					drawImage( g, m_img, origin_x, origin_y );
				}
				drawStatus( true );
				g.setFont( font[FONT_SMALL] );
				switch( help ){
				case 0:
					{
						int y;
						g.setColor( COLOR_W );
						y = drawStringTurn( "敵の発するｳｪｰﾌﾞと同色のﾊﾞﾘｱでくぐり抜けよ!", 5, 55, 230 );
						y = drawStringTurn( "敵に接近すると自動攻撃!", 5, y + 10, 230 );
						drawStringTurn( "ﾚｰﾀﾞｰに表示されているﾀｰｹﾞｯﾄを全て破壊するとｽﾃｰｼﾞｸﾘｱです.", 5, y + 10, 230 );
						if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
							centerDrawString( "▼", FONT_SMALL, 215 );
						}
					}
					break;
				case 1:
					{
						int y;
						g.setColor( COLOR_W );
						if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
							centerDrawString( "▲", FONT_SMALL, 35 );
						}
						centerDrawString( "残りﾀｲﾑについて", FONT_SMALL, 60 );
						y = drawStringTurn( "残りﾀｲﾑがｾﾞﾛになってもﾐｽになりません.", 5, 95, 230 );
						drawStringTurn( "残りﾀｲﾑは,ｸﾘｱ時にｽｺｱに加算されます.速くｽﾃｰｼﾞｸﾘｱするほど,高いｽｺｱが得られます.", 5, y + 10, 230 );
						if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
							centerDrawString( "▼", FONT_SMALL, 215 );
						}
					}
					break;
				case 2:
					{
						int y;
						g.setColor( COLOR_W );
						if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
							centerDrawString( "▲", FONT_SMALL, 35 );
						}
						centerDrawString( "ﾍﾞｽﾄﾀｲﾑについて", FONT_SMALL, 60 );
						y = drawStringTurn( "ｽﾃｰｼﾞ毎のﾍﾞｽﾄﾀｲﾑを記録しています.できるだけ速いｽﾃｰｼﾞｸﾘｱを目差そう!", 5, 95, 230 );
						drawStringTurn( "なお,ﾀﾞﾒｰｼﾞ1回につき680ﾎﾟｲﾝﾄのﾍﾟﾅﾙﾃｨが付きます.", 5, y + 10, 230 );
						if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
							centerDrawString( "▼", FONT_SMALL, 215 );
						}
					}
					break;
				case 3:
					{
						int x;
						g.setColor( COLOR_W );
						if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
							centerDrawString( "▲", FONT_SMALL, 35 );
						}
						centerDrawString( "ﾀｲﾄﾙ画面での操作", FONT_SMALL, 60 );
						drawHelpTitle( "説明", 100, 95 );
						drawHelpButton( "ｿﾌﾄ1", 110, 95 );
						drawHelpTitle( "ｱﾌﾟﾘ終了", 100, 120 );
						drawHelpButton( "ｿﾌﾄ2", 110, 120 );
						drawHelpTitle( "ﾚﾍﾞﾙ選択", 100, 145 );
						x = drawHelpButton( "↑", 110, 145 );
						drawHelpButton( "↓", x + 5, 145 );
						drawHelpTitle( "ｽﾃｰｼﾞ選択", 100, 170 );
						x = drawHelpButton( "←", 110, 170 );
						drawHelpButton( "→", x + 5, 170 );
						drawHelpTitle( "ｹﾞｰﾑ開始", 100, 195 );
						drawHelpButton( "決定", 110, 195 );
						if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
							centerDrawString( "▼", FONT_SMALL, 215 );
						}
					}
					break;
				case 4:
					{
						int x;
						g.setColor( COLOR_W );
						if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
							centerDrawString( "▲", FONT_SMALL, 35 );
						}
						centerDrawString( "ﾌﾟﾚｲ中の操作(1)", FONT_SMALL, 60 );
						drawHelpTitle( "自機の移動", 100, 95 );
						x = drawHelpButton( "↑", 110, 95 );
						x = drawHelpButton( "↓", x + 5, 95 );
						x = drawHelpButton( "←", x + 5, 95 );
						drawHelpButton( "→", x + 5, 95 );
						g.setColor( COLOR_C ); drawHelpTitle( "青色ﾊﾞﾘｱ", 100, 120 ); g.setColor( COLOR_W );
						x = drawHelpButton( "ｿﾌﾄ1", 110, 120 );
						x = drawHelpButton( "4", x + 5, 120 );
						x = drawHelpButton( "7", x + 5, 120 );
						drawHelpButton( "*", x + 5, 120 );
						g.setColor( COLOR_M ); drawHelpTitle( "赤色ﾊﾞﾘｱ", 100, 145 ); g.setColor( COLOR_W );
						x = drawHelpButton( "決定", 110, 145 );
						x = drawHelpButton( "5", x + 5, 145 );
						x = drawHelpButton( "8", x + 5, 145 );
						drawHelpButton( "0", x + 5, 145 );
						g.setColor( COLOR_Y ); drawHelpTitle( "黄色ﾊﾞﾘｱ", 100, 170 ); g.setColor( COLOR_W );
						x = drawHelpButton( "ｿﾌﾄ2", 110, 170 );
						x = drawHelpButton( "6", x + 5, 170 );
						x = drawHelpButton( "9", x + 5, 170 );
						drawHelpButton( "#", x + 5, 170 );
						drawStringTurn( "ﾊﾞﾘｱ切り替えｷｰの押し続けでﾌﾞｰｽﾄ", 5, 195, 230 );
						if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
							centerDrawString( "▼", FONT_SMALL, 215 );
						}
					}
					break;
				case 5:
					{
						int x;
						g.setColor( COLOR_W );
						if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
							centerDrawString( "▲", FONT_SMALL, 35 );
						}
						centerDrawString( "ﾌﾟﾚｲ中の操作(2)", FONT_SMALL, 60 );
						drawHelpTitle( "ﾎﾟｰｽﾞ", 100, 95 );
						drawHelpButton( "1", 110, 95 );
						drawHelpTitle( "ﾏｯﾌﾟON/OFF", 100, 120 );
						drawHelpButton( "2", 110, 120 );
						drawHelpTitle( "ﾀｲﾄﾙに戻る", 100, 145 );
						drawHelpButton( "3", 110, 145 );
						if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
							centerDrawString( "▼", FONT_SMALL, 215 );
						}
					}
					break;
				case 6:
					{
						int y;
						g.setColor( COLOR_W );
						if( (_elapse % WAIT_1) <= (WAIT_1 / 2) ){
							centerDrawString( "▲", FONT_SMALL, 35 );
						}
						centerDrawString( "ﾌﾞｰｽﾄについて", FONT_SMALL, 60 );
						y = drawStringTurn( "ﾊﾞﾘｱ切り替えｷｰを押している間,ﾌﾞｰｽﾄになります.", 5, 95, 230 );
						drawStringTurn( "ﾌﾞｰｽﾄ中は攻撃力が倍になります.それと引き換えに,ﾀｲﾑの減少ｽﾋﾟｰﾄﾞが倍になります.攻撃していない時にﾌﾞｰｽﾄすると損です.", 5, y + 10, 230 );
					}
					break;
				}
				g.unlock( true );
				break;
			case STATE_READY:
				// 描画
				g.lock();
				drawStage( false );
				jiki.draw( false );
				drawStatus( false );
				g.setColor( COLOR_W );
				centerDrawString(
					"STAGE " + ((st_index < 9) ? "0" : "") + (st_index + 1),
					FONT_SMALL,
					115
					);
				centerDrawString( "R E A D Y", FONT_SMALL, 135 );
				g.unlock( true );

				// 一定時間過ぎたらゲーム開始
				if( _elapse > WAIT_2 ){
					set_state( STATE_PLAY );
				}

				break;
			case STATE_PLAY:
				if( !pause ){
					// ブースト
					if( (level < 2) || (level > 3) ){
						boost = ((key & BOOST) != 0) ? true : false;
					}

					if( bonus > 0 ){
						bonus -= (boost ? 2 : 1); if( bonus < 0 ) bonus = 0;
					}

					// 更新
					stage.update( false );
					if( (_elapse % RING_FRAME) == 0 ){
						wave.update();
					}
					shots.update();

					// 自機の移動
					if     ( (key & (1 << Display.KEY_DOWN )) != 0 ) jiki.down ();
					else if( (key & (1 << Display.KEY_LEFT )) != 0 ) jiki.left ();
					else if( (key & (1 << Display.KEY_RIGHT)) != 0 ) jiki.right();
					else if( (key & (1 << Display.KEY_UP   )) != 0 ) jiki.up   ();
					else jiki.inertia();

					// 自機のダメージ
					if( wave.hit() || shots.hit() || stage.spear() ) jiki.damage();
#ifdef DEBUG
				} else {
					if( (key & (1 << Display.KEY_DOWN )) != 0 ) jiki.move( 0,  JIKI_MOVE2 );
					if( (key & (1 << Display.KEY_LEFT )) != 0 ) jiki.move( -JIKI_MOVE2, 0 );
					if( (key & (1 << Display.KEY_RIGHT)) != 0 ) jiki.move(  JIKI_MOVE2, 0 );
					if( (key & (1 << Display.KEY_UP   )) != 0 ) jiki.move( 0, -JIKI_MOVE2 );
#endif // DEBUG
				}

				// 描画
				g.lock();
				drawStage( false );
#ifndef WAVE_FULLTIME
				if( (elapse() % 2) == 0 ){
#endif // WAVE_FULLTIME
					wave.draw();
#ifndef WAVE_FULLTIME
				}
#endif // WAVE_FULLTIME
				jiki.draw( pause );
				shots.draw();
				stage.attack( pause );
				drawStatus( false );
				if( _elapse < WAIT_2 ){
					g.setColor( COLOR_W );
					centerDrawString( "S T A R T !", FONT_SMALL, 125 );
				}
				if( pause ){
					if( (_elapse_p % WAIT_1) <= (WAIT_1 / 2) ){
						g.setColor( COLOR_W );
						centerDrawString( "PAUSE", FONT_SMALL, 135 );
					}
				}
				g.unlock( true );

				if( stage.destroyed() ){
					// ステージクリア
					set_state( STATE_CLEAR );
				} else if( jiki.destroyed() ){
					// ゲームオーバー
					set_state( STATE_GAMEOVER );
				}

				break;
			case STATE_CLEAR:
				if( (bonus % 200) > 0 ){
					add_bonus( bonus % 200 );
					_elapse = 0;
				} else if( bonus >= 200 ){
					add_bonus( 200 );
					_elapse = 0;
				}

				// 更新
				stage.update( true );

				// 描画
				g.lock();
				drawStage( false );
				jiki.draw( false );
				drawStatus( false );
				g.setColor( COLOR_W );
				{
					centerDrawString( "C L E A R !", FONT_SMALL, 105 );
					String str = new String( "" );
					str = ((fontHeight( FONT_SMALL ) > 16) ? "SC " : "SCORE ") + new_s;
					if( bonus_d > 0 ){
						str = str + "(BONUS " + bonus_d + ")";
					}
					if( new_score ){
						str = str + " UP!";
					}
					centerDrawString( str, FONT_SMALL, 125 );
					str = "TIME " + new_t;
					if( miss > 0 ){
						str = str + "(MISS " + miss + ")";
					}
					if( new_record ){
						str = str + " UP!";
					}
					centerDrawString( str, FONT_SMALL, 145 );
				}
				g.unlock( true );

				// 一定時間過ぎたらゲーム開始
				if( _elapse > WAIT_2 ){
					set_state( STATE_READY );
				}

				break;
			case STATE_GAMEOVER:
				// 更新
				stage.update( false );
				if( (_elapse % RING_FRAME) == 0 ){
					wave.update();
				}
				shots.update();

				// 描画
				g.lock();
				drawStage( false );
#ifndef WAVE_FULLTIME
				if( (_elapse % 2) == 0 ){
#endif // WAVE_FULLTIME
					wave.draw();
#ifndef WAVE_FULLTIME
				}
#endif // WAVE_FULLTIME
				jiki.draw( false );
				shots.draw();
				drawStatus( false );
				g.setColor( COLOR_W );
				centerDrawString( "G A M E  O V E R", FONT_SMALL, 125 );
				g.unlock( true );

				// 一定時間過ぎたらタイトル画面へ
				if( _elapse > WAIT_4 ){
					set_state( STATE_TITLE );
				}

				break;
			}

			if( (state != STATE_PLAY) || !pause ){
				_elapse++;
			}
			if( pause ){
				_elapse_p++;
			} else {
				if( quake > 0 ) quake--;
			}

			unlock_state();
		}

		/**
		 * キー入力処理
		 */
		public void processEvent( int type, int param ){
			if( processingEvent ) return;
			processingEvent = true;

			if( type == Display.KEY_PRESSED_EVENT ){
				switch( state ){
				case STATE_LAUNCH:
					break;
				case STATE_TITLE:
					switch( param ){
					case Display.KEY_SOFT1:
						lock_state();
						set_state( STATE_HELP );
						unlock_state();
						break;
					case Display.KEY_SOFT2:
						IApplication.getCurrentApp().terminate();
						break;
					case Display.KEY_UP:
						level--; if( level < 0 ) level = 0;
						stage_update();
						break;
					case Display.KEY_DOWN:
						level++; if( level > level_max ) level = level_max;
						stage_update();
						break;
					case Display.KEY_LEFT:
						st_index--; if( st_index < 0 ) st_index = 0;
						break;
					case Display.KEY_RIGHT:
						st_index++; if( st_index >= STAGE_NUM ) st_index = STAGE_NUM - 1;
						stage_update();
						break;
					}
					break;
				case STATE_HELP:
					switch( param ){
					case Display.KEY_SOFT1:
						lock_state();
						set_state( STATE_TITLE );
						unlock_state();
						break;
					case Display.KEY_SOFT2:
						IApplication.getCurrentApp().terminate();
						break;
					case Display.KEY_UP:
						help--; if( help < 0 ) help = 0;
						break;
					case Display.KEY_DOWN:
						help++; if( help > 6 ) help = 6;
						break;
					}
					break;
				default:
					switch( param ){
					case Display.KEY_1:
						pause = pause ? false : true; if( pause ) _elapse_p = 0;
						break;
					case Display.KEY_2:
						map = map ? false : true;
						break;
					case Display.KEY_3:
						lock_state();
						set_state( STATE_TITLE );
						unlock_state();
						break;
					case Display.KEY_SOFT1:
					case Display.KEY_4:
					case Display.KEY_7:
					case Display.KEY_ASTERISK:
						if( !pause ) jiki.barrier( 0 );
						break;
					case Display.KEY_SELECT:
					case Display.KEY_5:
					case Display.KEY_8:
					case Display.KEY_0:
						if( !pause ) jiki.barrier( 1 );
						break;
					case Display.KEY_SOFT2:
					case Display.KEY_6:
					case Display.KEY_9:
					case Display.KEY_POUND:
						if( !pause ) jiki.barrier( 2 );
						break;
					}
					break;
				}
			}

			processingEvent = false;
		}
	}

	/**
	 * ステージ
	 */
	class Stage {
		int chip = 1;				// パーツ画像の横方向チップ数
		int line = 1;				//
		int base = 1;				// ベース判定用
		int bg_line;				// ランダム背景パターンの行番号
		int bg_num = 0;				// ランダム背景パターン数
		int[][] base_data;			// ベース情報
		Image[] base_image;			// ベース画像
		int base_index;				//
		int base_x, base_y;			//
#ifdef BACK_IMAGE
		Image back_image = null;	// 背景イメージ
#endif // BACK_IMAGE
		MediaImage c_mimg;			// チップイメージ
		Image c_img = null;			// チップイメージ
		MediaImage[] mimg;			//
		Image[] img;				//
		Vector enemy;				// 敵情報
		int enemy_size;				//
		int _attack;				// 最後に攻撃した敵のインデックス
		int attack_x, attack_y;		// 自機が攻撃した位置
		int attack_x1, attack_y1;	//
		int attack_x2, attack_y2;	//
		int pattern;

		int _win_x, _win_y;			// ウィンドウ左上座標

		// ウィンドウ左上座標を確認
		public int win_x(){ return _win_x; }
		public int win_y(){ return _win_y; }

		/**
		 * コンストラクタ
		 */
		Stage(){
			base_data = new int[41][41];
			mimg = new MediaImage[4];
			img = new Image[4];
			try {
				mimg[IMAGE_BAKU ] = MediaManager.getImage( "resource:///baku.gif"  );
				mimg[IMAGE_ENEMY] = MediaManager.getImage( "resource:///enemy.gif" );
				mimg[IMAGE_BAKU ].use();
				img[IMAGE_BAKU ] = mimg[IMAGE_BAKU ].getImage();
				mimg[IMAGE_ENEMY].use();
				img[IMAGE_ENEMY] = mimg[IMAGE_ENEMY].getImage();
			} catch( Exception e ){
			}
			img[IMAGE_LIGHT  ] = null;
			img[IMAGE_ENEMY_D] = null;
			enemy = new Vector();
			_attack = -1;

			base_image = new Image[2];
			base_image[0] = null;
			base_image[1] = null;
		}

		/**
		 * 闇ステージ用イメージ読み込み
		 */
		public void create_dark_image(){
			if( img[IMAGE_LIGHT] == null ){
				try {
					mimg[IMAGE_LIGHT  ] = MediaManager.getImage( "resource:///light.gif"  );
					mimg[IMAGE_ENEMY_D] = MediaManager.getImage( "resource:///enemyd.gif" );
					mimg[IMAGE_LIGHT  ].use();
					img[IMAGE_LIGHT  ] = mimg[IMAGE_LIGHT  ].getImage();
					mimg[IMAGE_ENEMY_D].use();
					img[IMAGE_ENEMY_D] = mimg[IMAGE_ENEMY_D].getImage();
				} catch( Exception e ){
				}
			}
		}

		/**
		 * 闇ステージ用イメージ解放
		 */
		public void dispose_dark_image(){
			if( img[IMAGE_LIGHT] != null ){
				img[IMAGE_LIGHT].dispose();
				mimg[IMAGE_LIGHT].dispose();
				img[IMAGE_LIGHT] = null;
				img[IMAGE_ENEMY_D].dispose();
				mimg[IMAGE_ENEMY_D].dispose();
				img[IMAGE_ENEMY_D] = null;
				System.gc();
			}
		}

		/**
		 * ステージデータ読み込み
		 */
		private boolean load(){
			int i, j;
			enemy.removeAllElements();
			enemy_size = 0;
			try {
				InputStream in = Connector.openInputStream( "resource:///stage" + st_index + ".txt" );
				StreamReader reader = new StreamReader();
				reader.begin( in );
				String str = new String( "" );
				int[] val = new int[6];
				int zero = 0;
				chip = 1;
				line = 1;
				base = 1;
				bg_num = 0;
				dark = false;
				while( true ){
					str = reader.read();
					if( str.length() <= 0 ) break;
					if( str.charAt( 0 ) == 'E' ){
						for( i = 0; i < 6; i++ ){
							val[i] = reader.read_val();
						}
						val[0] *= 24;
						val[1] *= 24;
						if( val[5] < 10 ) val[5] *= 30;
						if( str.equals( "EE" ) ){
							if( (level % 2) == 0 ){
								enemy.addElement( new Enemy( val[0], val[1], val[2], val[3], val[4], val[5] ) );
							}
						} else if( str.equals( "EH" ) ){
							if( (level % 2) == 1 ){
								enemy.addElement( new Enemy( val[0], val[1], val[2], val[3], val[4], val[5] ) );
							}
						} else {
							if( (level % 2) == 1 ){
								if( val[2] < 4 ){
									val[3] = val[3] * 2 / 3;
								} else {
									val[3] /= 2;
								}
								val[4] %= val[3];
							}
							enemy.addElement( new Enemy( val[0], val[1], val[2], val[3], val[4], val[5] ) );
						}
					} else if( str.equals( "C" ) ){
						chip = reader.read_val();
						line = reader.read_val();
						base = chip * line;
					} else if( str.equals( "B" ) ){
						bg_line = reader.read_val();
						bg_num  = reader.read_val();
					} else if( str.equals( "D" ) ){
#ifndef DEBUG
						dark = true;
#endif // DEBUG
					} else if( str.equals( "Z" ) ){
						zero = reader.read_val();
					} else {
						base_data[0][0] = Integer.parseInt( str );
						if( base_data[0][0] == 0 ){
							base_data[0][0] = zero;
						}
						i = 1;
						for( j = 0; j < 40; j++ ){
							for( ; i < 40; i++ ){
								base_data[i][j] = reader.read_val();
								if( base_data[i][j] == 0 ){
									base_data[i][j] = zero;
								}
							}
							i = 0;
						}
					}
				}
				reader.end();
				in.close();
			} catch( Exception e ){
				if( dark ){
					create_dark_image();
				} else {
					dispose_dark_image();
				}
				return false;
			}
			if( dark ){
				create_dark_image();
			} else {
				dispose_dark_image();
			}
			enemy_size = enemy.size();
			return true;
		}

		/**
		 * ステージデータ構築
		 */
		public void create(){
			int i, j;

			// ステージデータ読み込み
			if( !load() ){
				// これ以上ステージが無いので最初に戻る
				new_level();
				load();
			}

			// 自機イメージ読み込み
			jiki.load_image();

			// チップイメージ読み込み
			if( c_img != null ){
				c_img.dispose();
				c_mimg.dispose();
				c_img = null;
			}
			try {
				c_mimg = MediaManager.getImage( "resource:///base" + st_index + ".gif" );
				c_mimg.use();
				c_img = c_mimg.getImage();
			} catch( Exception e ){
			}

			// イメージ構築
#ifdef BACK_IMAGE
			if( back_image != null ){
				back_image.dispose();
				back_image = null;
			}
#endif // BACK_IMAGE
			if( base_image[0] != null ){
				base_image[0].dispose();
				base_image[0] = null;
			}
			if( base_image[1] != null ){
				base_image[1].dispose();
				base_image[1] = null;
			}
#ifdef BACK_IMAGE
			if( bg_num > 0 ){
				back_image = Image.createImage( 240, 240 );
			} else {
#endif // BACK_IMAGE
				base_image[0] = Image.createImage( 240, 240 );
				base_image[1] = Image.createImage( 240, 240 );
				base_index = -1;
#ifdef BACK_IMAGE
			}
#endif // BACK_IMAGE

#ifdef BACK_IMAGE
			// 背景イメージ描画
			if( back_image != null ){
				Graphics g2 = back_image.getGraphics();
				for( j = 0; j < 10; j++ ){
					for( i = 0; i < 10; i++ ){
						drawImage( g2, c_img,
							i * 24, j * 24,
							Math.abs( rand.nextInt() % bg_num ) * 24,
							bg_line * 24,
							24, 24
							);
					}
				}
			}
#endif // BACK_IMAGE

			System.gc();

			attack_x = -1;
			pattern = 0;
		}

		/**
		 * ステージデータ更新
		 */
		public void update( boolean stage_clear ){
			for( int i = enemy_size - 1; i >= 0; i-- ){
				Enemy tmp = (Enemy)enemy.elementAt( i );
				tmp.update( stage_clear );
			}

			if( !stage_clear ){
				pattern++; if( pattern > 1 ) pattern = 0;
			}
		}

		/**
		 * 自機の敵への攻撃
		 */
		public void attack( boolean pause ){
#ifdef DEBUG
			if( pause ) return;
#endif // DEBUG
			if( jiki.destroyed() ) return;
			int i, j;
			int jx = jiki.x() + 12;
			int jy = jiki.y() + 12;
			int ex, ey;
			j = -1;
			if( (level < 4) || (level > 5) ){
				int w, h;
				int dist = 96 * 96;
				int tmp_d;
				for( i = enemy_size - 1; i >= 0; i-- ){
					Enemy tmp = (Enemy)enemy.elementAt( i );
					if( !tmp.destroyed() ){
						ex = tmp.x() + 12;
						ey = tmp.y() + 12;
						w = jx - ex;
						h = jy - ey;
						tmp_d = w * w + h * h;
						if( tmp_d <= dist ){
							if( !kabe12( ex / 12, ey / 12, jx / 12, jy / 12 ) ){
								j = i;
								dist = tmp_d;
							}
						}
					}
				}
				if( j >= 0 ){
					Enemy tmp = (Enemy)enemy.elementAt( j );
					if( level < 4 ){
						setCMYColor( elapse() % 3 );
					} else {
						if( dist <= 32 * 32 ){
							g.setColor( COLOR_W );
						} else if( dist <= 64 * 64 ){
							g.setColor( COLOR_Y );
						} else {
							g.setColor( COLOR_M );
						}
					}
					if( !pause ){
						attack_x = tmp.x() + 12 + (rand.nextInt() % 9);
						attack_y = tmp.y() + 12 + (rand.nextInt() % 9);
					}
					if( attack_x >= 0 ){
						if( boost ){
							if( !pause ){
								attack_x1 = jx       + ((attack_x - jx) / 3) + (rand.nextInt() % 9);
								attack_y1 = jy       + ((attack_y - jy) / 3) + (rand.nextInt() % 9);
								attack_x2 = attack_x - ((attack_x - jx) / 3) + (rand.nextInt() % 9);
								attack_y2 = attack_y - ((attack_y - jy) / 3) + (rand.nextInt() % 9);
							}
							drawLine( jx, jy, attack_x1, attack_y1 );
							drawLine( attack_x1, attack_y1, attack_x2, attack_y2 );
							drawLine( attack_x2, attack_y2, attack_x, attack_y );
						} else {
							drawLine( jx, jy, attack_x, attack_y );
						}
					}
					if( !pause ){
						if( level < 4 ){
							tmp.damage( boost ? 2 : 1 );
						} else {
							if( dist <= 32 * 32 ){
								tmp.damage( boost ? 6 : 3 );
							} else if( dist <= 64 * 64 ){
								tmp.damage( boost ? 4 : 2 );
							} else {
								tmp.damage( boost ? 2 : 1 );
							}
						}
						if( tmp.destroyed() ) add_score( tmp.max_damage() * 10 );
					}
				}
			} else {
				if( boost ){
					for( i = enemy_size - 1; i >= 0; i-- ){
						Enemy tmp = (Enemy)enemy.elementAt( i );
						if( !tmp.destroyed() && tmp.show() ){
							ex = tmp.x() + 12;
							ey = tmp.y() + 12;
							if( !kabe12( ex / 12, ey / 12, jx / 12, jy / 12 ) ){
								setCMYColor( elapse() % 3 );
								if( !pause ){
									attack_x = rand.nextInt() % 9;
									attack_y = rand.nextInt() % 9;
								}
								drawLine( jx, jy, tmp.x() + 12 + attack_x, tmp.y() + 12 + attack_y );
								if( !pause ){
									tmp.damage( 1 );
									if( tmp.destroyed() ) add_score( tmp.max_damage() * 10 );
								}
							}
						}
					}
				} else {
					if( pause ){
						j = _attack;
					} else {
						int k;
						for( k = 0; k < 2; k++ ){
							for( i = _attack + 1; i < enemy_size; i++ ){
								Enemy tmp = (Enemy)enemy.elementAt( i );
								if( !tmp.destroyed() && tmp.show() ){
									ex = tmp.x() + 12;
									ey = tmp.y() + 12;
									if( !kabe12( ex / 12, ey / 12, jx / 12, jy / 12 ) ){
										j = i;
										break;
									}
								}
							}
							if( j >= 0 ){
								_attack = j;
								break;
							}
							_attack = -1;
						}
					}
					if( j >= 0 ){
						Enemy tmp = (Enemy)enemy.elementAt( j );
						setCMYColor( elapse() % 3 );
						if( !pause ){
							attack_x = rand.nextInt() % 9;
							attack_y = rand.nextInt() % 9;
						}
						drawLine( jx, jy, tmp.x() + 12 + attack_x, tmp.y() + 12 + attack_y );
						if( !pause ){
							tmp.damage( 1 );
							if( tmp.destroyed() ) add_score( tmp.max_damage() * 10 );
						}
					}
				}
			}
		}

		/**
		 * 敵が全滅したかどうかチェック
		 */
		public boolean destroyed(){
			for( int i = enemy_size - 1; i >= 0; i-- ){
				Enemy tmp = (Enemy)enemy.elementAt( i );
				if( (tmp.type() == ENEMY_0) && !tmp.destroyed() ) return false;
			}
			return true;
		}

		/**
		 * 当たり判定
		 */
		public int hit( int x, int y ){
			if( (x < 0) || (x > 936) || (y < 0) || (y > 936) ) return BASE_KABE;
			int x2 = (x + 12) / 24;
			int y2 = (y + 12) / 24;
			int x3 = x / 24;
			int y3 = y / 24;
			int x4 = x3 + 1;
			int y4 = y3 + 1;
			boolean slow = false;

			// 敵との当たり判定
			for( int i = enemy_size - 1; i >= 0; i-- ){
				Enemy tmp = (Enemy)enemy.elementAt( i );
				if( tmp.destroyed() ){
					if( (tmp.type() == ENEMY_0) || (tmp.type() == ENEMY_4) ){
						if( ((tmp.x() / 24) == x2) && ((tmp.y() / 24) == y2) ) slow = true;
					}
				} else if( (x != tmp.x()) || (y != tmp.y()) ){
					if( (Math.abs( tmp.x() - x ) < 24) && (Math.abs( tmp.y() - y ) < 24) ) return BASE_KABE;
				}
			}

			// 自機との当たり判定
			if( (x != jiki.x()) || (y != jiki.y()) ){
				if( (Math.abs( jiki.x() - x ) < 24) && (Math.abs( jiki.y() - y ) < 24) ) return BASE_KABE;
			}

			// ベースとの当たり判定
			if( ((x % 24) != 0) && ((y % 24) != 0) ){
				if( base_data[x3][y3] / base == BASE_KABE      ) return BASE_KABE;
				if( base_data[x3][y4] / base == BASE_KABE      ) return BASE_KABE;
				if( base_data[x4][y3] / base == BASE_KABE      ) return BASE_KABE;
				if( base_data[x4][y4] / base == BASE_KABE      ) return BASE_KABE;
				if( base_data[x3][y3] / base == BASE_GUARDRAIL ) return BASE_KABE;
				if( base_data[x3][y4] / base == BASE_GUARDRAIL ) return BASE_KABE;
				if( base_data[x4][y3] / base == BASE_GUARDRAIL ) return BASE_KABE;
				if( base_data[x4][y4] / base == BASE_GUARDRAIL ) return BASE_KABE;
			} else if( (x % 24) != 0 ){
				if( base_data[x3][y3] / base == BASE_KABE      ) return BASE_KABE;
				if( base_data[x4][y3] / base == BASE_KABE      ) return BASE_KABE;
				if( base_data[x3][y3] / base == BASE_GUARDRAIL ) return BASE_KABE;
				if( base_data[x4][y3] / base == BASE_GUARDRAIL ) return BASE_KABE;
			} else if( (y % 24) != 0 ){
				if( base_data[x3][y3] / base == BASE_KABE      ) return BASE_KABE;
				if( base_data[x3][y4] / base == BASE_KABE      ) return BASE_KABE;
				if( base_data[x3][y3] / base == BASE_GUARDRAIL ) return BASE_KABE;
				if( base_data[x3][y4] / base == BASE_GUARDRAIL ) return BASE_KABE;
			}
			return slow ? BASE_SLOW : base_data[x2][y2] / base;
		}

		/**
		 * 槍との当たり判定
		 */
		public boolean spear(){
			for( int i = enemy_size - 1; i >= 0; i-- ){
				Enemy tmp = (Enemy)enemy.elementAt( i );
				if( !tmp.destroyed() && (tmp.type() == ENEMY_6) ){
					if(
						(tmp.spear_x() >= jiki.x()     ) &&
						(tmp.spear_x() <  jiki.x() + 24) &&
						(tmp.spear_y() >= jiki.y()     ) &&
						(tmp.spear_y() <  jiki.y() + 24)
					){
						return true;
					}
				}
			}
			return false;
		}

		/**
		 * 指定位置が壁かどうかチェック(注意：画面外チェックは行っていない)
		 */
		public boolean kabe12( int x, int y ){
			if( base_data[x / 2][y / 2] / base == BASE_KABE ) return true;
			return false;
		}

		/**
		 * 直線が壁に遮られているかチェック(注意：画面外チェックは行っていない)
		 */
		public boolean kabe12( int x0, int y0, int x1, int y1 ){
			int i;
			int e, x, y;
			int dx, dy, sx, sy;
			sx = (x1 > x0) ? 1 : -1;
			dx = (x1 > x0) ? x1 - x0 : x0 - x1;
			sy = (y1 > y0) ? 1 : -1;
			dy = (y1 > y0) ? y1 - y0 : y0 - y1;
			x = x0;
			y = y0;
			if( dx >= dy ){
				e = -dx;
				for( i = 0; i <= dx; i++ ){
					if( base_data[x / 2][y / 2] / base == BASE_KABE ) return true;
					x += sx;
					e += 2 * dy;
					if( e >= 0 ){
						y += sy;
						e -= 2 * dx;
					}
				}
			} else {
				e = -dy;
				for( i = 0; i <= dy; i++ ){
					if( base_data[x / 2][y / 2] / base == BASE_KABE ) return true;
					y += sy;
					e += 2 * dx;
					if( e >= 0 ){
						x += sx;
						e -= 2 * dy;
					}
				}
			}
			return false;
		}

		/**
		 * 爆発
		 */
		public void baku( int x, int y, int w, int elapse ){
			int i;
			i =  elapse / BAKU_FRAME; if( (i >= 0) && (i < 5) ) drawImage( img[IMAGE_BAKU], x, y, i * 24, 0, 24, 24 );
			if( w > 26 ){
				if( i == 0 ) quake = 15;
				i = (elapse - BAKU_LAG1) / BAKU_FRAME; if( (i >= 0) && (i < 5) ) drawImage( img[IMAGE_BAKU], x - 6, y - 6, i * 24, 0, 24, 24 );
				i = (elapse - BAKU_LAG2) / BAKU_FRAME; if( (i >= 0) && (i < 5) ) drawImage( img[IMAGE_BAKU], x + 6, y - 2, i * 24, 0, 24, 24 );
				i = (elapse - BAKU_LAG3) / BAKU_FRAME; if( (i >= 0) && (i < 5) ) drawImage( img[IMAGE_BAKU], x + 2, y + 6, i * 24, 0, 24, 24 );
			}
		}

		/**
		 * 描画
		 */
		public void draw( boolean title ){
			int i, j, x, y, w, h;
			int y2, y3;
			int qx, qy;

			_win_x = jiki.x() - 96;
			_win_y = jiki.y() - 96;
			if( _win_x < 0 ){
				_win_x = 0;
			} else if( _win_x + 216 > 960 ){
				_win_x = 960 - 216;
			}
			if( _win_y < 0 ){
				_win_y = 0;
			} else if( _win_y + 216 > 960 ){
				_win_y = 960 - 216;
			}

			if( !title && dark ){
				setClip( jiki.light_x() - _win_x, jiki.light_y() - _win_y, 120, 120 );
			}
			if( quake > 0 ){
				qx = quake_x;
				qy = quake_y;
				setOrigin( 12 + qx, 12 + qy );
			} else {
				qx = 0;
				qy = 0;
			}
#ifdef BACK_IMAGE
			if( back_image != null ){
				// 背景の描画
				x = _win_x / 3;
				y = _win_y / 3;
				w = 240 - x;
				h = 240 - y;
				if( w > 0 && h > 0 ) drawImage( g, back_image, 0 + origin_x, 0 + origin_y, x, y, w, h );
				if( x > 0 && h > 0 ) drawImage( g, back_image, w + origin_x, 0 + origin_y, 0, y, x, h );
				if( w > 0 && y > 0 ) drawImage( g, back_image, 0 + origin_x, h + origin_y, x, 0, w, y );
				if( x > 0 && y > 0 ) drawImage( g, back_image, w + origin_x, h + origin_y, 0, 0, x, y );

				// 前景の描画
				int off_x = _win_x % 24;
				int off_y = _win_y % 24;
				x = _win_x / 24;
				y = _win_y / 24;
				w = (off_x == 0) ? 9 : 10;
				h = (off_y == 0) ? 9 : 10;
				for( j = 0; j < h; j++ ){
					y2 = j * 24 - off_y;
					y3 = y + j;
					for( i = 0; i < w; i++ ){
						drawImage( g, c_img,
							(i * 24 - off_x) + origin_x, y2 + origin_y,
							(base_data[x + i][y3] % chip) * 24,
							(base_data[x + i][y3] / chip) * 24,
							24, 24
							);
					}
				}
			} else if( base_image[0] != null ){
#else
			if( base_image[0] != null ){
#endif // BACK_IMAGE
				if( base_index < 0 ){
					// 初回
					base_index = 0;
					Graphics g2 = base_image[base_index].getGraphics();
					base_x = _win_x / 24;
					base_y = _win_y / 24;
					for( j = 0; j < 10; j++ ){
						y2 = j * 24;
						y3 = base_y + j;
						for( i = 0; i < 10; i++ ){
							if( bg_num > 0 ){
								drawImage( g2, c_img,
									i * 24, y2,
									Math.abs( rand.nextInt() % bg_num ) * 24,
									bg_line * 24,
									24, 24
									);
							}
							drawImage( g2, c_img,
								i * 24, y2,
								(base_data[base_x + i][y3] % chip) * 24,
								(base_data[base_x + i][y3] / chip) * 24,
								24, 24
								);
						}
					}
				} else {
					int new_index = (base_index == 0) ? 1 : 0;
					Graphics g2 = base_image[new_index].getGraphics();
					x = _win_x / 24;
					y = _win_y / 24;
					w = base_x - x;
					h = base_y - y;
					base_x = x;
					base_y = y;
					if( (w != 0) || (h != 0) ){
						drawImage( g2, base_image[base_index],
							(w > 0) ? ( w * 24) : 0,
							(h > 0) ? ( h * 24) : 0,
							(w < 0) ? (-w * 24) : 0,
							(h < 0) ? (-h * 24) : 0,
							240 - (Math.abs( w ) * 24),
							240 - (Math.abs( h ) * 24)
							);
						int is = 0, ie = 10;
						int js = 0, je = 10;
						if( w > 0 ){
							ie = w;
						} else if( w < 0 ){
							is = 10 + w;
						}
						if( h > 0 ){
							je = h;
						} else if( h < 0 ){
							js = 10 + h;
						}
						if( w != 0 ){
							for( j = 0; j < 10; j++ ){
								y2 = j * 24;
								y3 = base_y + j;
								for( i = is; i < ie; i++ ){
									if( bg_num > 0 ){
										drawImage( g2, c_img,
											i * 24, y2,
											Math.abs( rand.nextInt() % bg_num ) * 24,
											bg_line * 24,
											24, 24
											);
									}
									drawImage( g2, c_img,
										i * 24, y2,
										(base_data[base_x + i][y3] % chip) * 24,
										(base_data[base_x + i][y3] / chip) * 24,
										24, 24
										);
								}
							}
						}
						if( w > 0 ){
							is = w;
							ie = 10;
						} else if( w < 0 ){
							is = 0;
							ie = 10 - w;
						} else {
							is = 0;
							ie = 10;
						}
						if( h != 0 ){
							for( j = js; j < je; j++ ){
								y2 = j * 24;
								y3 = base_y + j;
								for( i = is; i < ie; i++ ){
									if( bg_num > 0 ){
										drawImage( g2, c_img,
											i * 24, y2,
											Math.abs( rand.nextInt() % bg_num ) * 24,
											bg_line * 24,
											24, 24
											);
									}
									drawImage( g2, c_img,
										i * 24, y2,
										(base_data[base_x + i][y3] % chip) * 24,
										(base_data[base_x + i][y3] / chip) * 24,
										24, 24
										);
								}
							}
						}
						base_index = new_index;
					}
				}
				drawImage( g, base_image[base_index],
					origin_x, origin_y,
					_win_x % 24, _win_y % 24,
					216, 216
					);
			}
			if( quake > 0 ){
				setOrigin( 12, 12 );
			}
			if( title ){
				return;
			}
			for( i = enemy_size - 1; i >= 0; i-- ){
				Enemy tmp = (Enemy)enemy.elementAt( i );
				if( tmp.destroyed() ){
					if( (tmp.type() == ENEMY_0) || (tmp.type() == ENEMY_4) ){
						drawImage( img[IMAGE_ENEMY],
							tmp.x() - 4 + qx, tmp.y() - 4 + qy,
							96, 0,
							32, 32
							);
					}
				} else {
					if( tmp.type() == ENEMY_0 ){
						if( tmp.attack() == RING_RANDOM ){
							tmp.show( drawImage( img[IMAGE_ENEMY],
								tmp.x() + qx, tmp.y() + qy,
								(elapse() % 3) * 32, 0,
								32, 32
								) );
						} else {
							tmp.show( drawImage( img[IMAGE_ENEMY],
								tmp.x() + qx, tmp.y() + qy,
								tmp.attack() * 32, 0,
								32, 32
								) );
						}
					} else if( tmp.type() == ENEMY_4 ){
						tmp.show( drawImage( img[IMAGE_ENEMY],
							tmp.x() - 4 + qx, tmp.y() - 4 + qy,
							(elapse() % 3) * tmp.w(), ENEMY_Y[pattern][tmp.type()],
							tmp.w(), tmp.w()
							) );
					} else if( tmp.w() > 26 ){
						tmp.show( drawImage( img[IMAGE_ENEMY],
							tmp.x() - 4, tmp.y() - 4,
							tmp.pattern() * tmp.w(), ENEMY_Y[pattern][tmp.type()],
							tmp.w(), tmp.w()
							) );
					} else {
						tmp.show( drawImage( img[IMAGE_ENEMY],
							tmp.x(), tmp.y(),
							tmp.pattern() * tmp.w(), ENEMY_Y[pattern][tmp.type()],
							tmp.w(), tmp.w()
							) );
					}
				}
			}
			if( dark ){
				drawImage( img[IMAGE_LIGHT], jiki.light_x(), jiki.light_y(), 120, 120 );
				setClip( 0, 0, 216, 216 );
			}
			for( i = enemy_size - 1; i >= 0; i-- ){
				Enemy tmp = (Enemy)enemy.elementAt( i );
				if( tmp.destroyed() ){
					baku( tmp.x(), tmp.y(), tmp.w(), tmp.elapse() );
				} else if( dark ){
					if( tmp.type() == ENEMY_0 ){
						if( tmp.attack() == RING_RANDOM ){
							drawImage( img[IMAGE_ENEMY_D],
								tmp.x() + qx, tmp.y() + qy,
								(elapse() % 3) * 32, 0,
								32, 32
								);
						} else {
							drawImage( img[IMAGE_ENEMY_D],
								tmp.x() + qx, tmp.y() + qy,
								tmp.attack() * 32, 0,
								32, 32
								);
						}
					} else if( tmp.type() == ENEMY_4 ){
						drawImage( img[IMAGE_ENEMY_D],
							tmp.x() - 4 + qx, tmp.y() - 4 + qy,
							(elapse() % 3) * tmp.w(), ENEMY_Y[pattern][tmp.type()],
							tmp.w(), tmp.w()
							);
					} else if( tmp.w() > 26 ){
						drawImage( img[IMAGE_ENEMY_D],
							tmp.x() - 4, tmp.y() - 4,
							tmp.pattern() * tmp.w(), ENEMY_Y[pattern][tmp.type()],
							tmp.w(), tmp.w()
							);
					} else {
						drawImage( img[IMAGE_ENEMY_D],
							tmp.x(), tmp.y(),
							tmp.pattern() * tmp.w(), ENEMY_Y[pattern][tmp.type()],
							tmp.w(), tmp.w()
							);
					}
				}
			}
			setCMYColor( elapse() % 3 );
			for( i = enemy_size - 1; i >= 0; i-- ){
				Enemy tmp = (Enemy)enemy.elementAt( i );
				if( !tmp.destroyed() && (tmp.type() == ENEMY_6) ){
					drawLine(
						tmp.x() + 12, tmp.y() + 12,
						tmp.spear_x(), tmp.spear_y()
						);
				}
			}
		}

		/**
		 * マップ描画
		 */
		public void draw_map( int x, int y ){
			g.setColor( COLOR_W );
			g.drawRect( x, y, 63, 63 );
			x += 2;
			y += 2;
			g.drawRect( x + jiki.x() / 16, y + jiki.y() / 16, 1, 1 );
			setCMYColor( elapse() % 3 );
			for( int i = enemy_size - 1; i >= 0; i-- ){
				Enemy tmp = (Enemy)enemy.elementAt( i );
				if( (tmp.type() == ENEMY_0) && !tmp.destroyed() ){
					g.drawRect( x + tmp.x() / 16, y + tmp.y() / 16, 1, 1 );
				}
			}
		}
	}

	/**
	 * ウェーブ
	 */
	class Wave {
		byte[][] wave_data;	// ウェーブ情報
		byte[][] draw_data;	// 描画時の作業用
		Vector ring;		// リング情報

		/**
		 * コンストラクタ
		 */
		Wave(){
			wave_data = new byte[80][80];
			draw_data = new byte[80][80];
			ring = new Vector();
		}

		/**
		 * 構築
		 */
		public void create(){
			clear();
			ring.removeAllElements();
			System.gc();
		}

		/**
		 * リングを登録する
		 */
		public void add_ring( int x, int y, int col ){
			ring.addElement( new Ring( x, y, col ) );
		}

		/**
		 * 点を描く
		 */
		private boolean put12( int x0, int y0, int x1, int y1, int col ){
			if( x1 < 0 || x1 >= 80 || y1 < 0 || y1 >= 80 ) return false;
			if( stage.kabe12( x0, y0, x1, y1 ) ) return false;
			wave_data[x1][y1] = (byte)col;
			return true;
		}

		/**
		 * クリア
		 */
		private void clear(){
			int i, j;
			for( i = 0; i < 80; i++ ){
				for( j = 0; j < 80; j++ ){
					wave_data[i][j] = -1;
				}
			}
		}

		/**
		 * ウェーブデータ更新
		 */
		public void update(){
			int i, j;

			clear();

			for( i = ring.size() - 1; i >= 0; i-- ){
				Ring tmp = (Ring)ring.elementAt( i );
				tmp.update();

				// 円を描く
				boolean ret = false;
				int x0 = tmp.x();
				int y0 = tmp.y();
				int r = tmp.elapse();
				int col = tmp.col();
				int x = r;
				int y = 0;
				int f = -2 * r + 3;
				while( x >= y ){
					if( put12( x0, y0, x0 + x, y0 + y, col ) ) ret = true;
					if( put12( x0, y0, x0 - x, y0 + y, col ) ) ret = true;
					if( put12( x0, y0, x0 + x, y0 - y, col ) ) ret = true;
					if( put12( x0, y0, x0 - x, y0 - y, col ) ) ret = true;
					if( put12( x0, y0, x0 + y, y0 + x, col ) ) ret = true;
					if( put12( x0, y0, x0 - y, y0 + x, col ) ) ret = true;
					if( put12( x0, y0, x0 + y, y0 - x, col ) ) ret = true;
					if( put12( x0, y0, x0 - y, y0 - x, col ) ) ret = true;
					if( f >= 0 ){
						x--;
						f -= 4 * x;
					}
					y++;
					f += 4 * y + 2;
				}

				if( ret == false ){
					ring.removeElementAt( i );
					System.gc();
				}
			}

			for( j = 1; j < 79; j++ ){
				for( i = 1; i < 79; i++ ){
					if( wave_data[i][j] >= 0 ){
						if(
							(wave_data[i - 1][j - 1] < 0) &&
							(wave_data[i    ][j - 1] < 0) &&
							(wave_data[i + 1][j - 1] < 0) &&
							(wave_data[i - 1][j    ] < 0) &&
							(wave_data[i + 1][j    ] < 0) &&
							(wave_data[i - 1][j + 1] < 0) &&
							(wave_data[i    ][j + 1] < 0) &&
							(wave_data[i + 1][j + 1] < 0)
						){
							wave_data[i][j] = -1;
						}
					}
				}
			}
		}

		/**
		 * 当たり判定
		 */
		public boolean hit(){
			int x = (jiki.x() + 6) / 12;
			int y = (jiki.y() + 6) / 12;
			if( (wave_data[x    ][y    ] >= 0) && (wave_data[x    ][y    ] != jiki.barrier()) ) return true;
			if( (wave_data[x + 1][y    ] >= 0) && (wave_data[x + 1][y    ] != jiki.barrier()) ) return true;
			if( (wave_data[x    ][y + 1] >= 0) && (wave_data[x    ][y + 1] != jiki.barrier()) ) return true;
			if( (wave_data[x + 1][y + 1] >= 0) && (wave_data[x + 1][y + 1] != jiki.barrier()) ) return true;
			return false;
		}

		/**
		 * 描画
		 */
		public void draw(){
			int i, j, k, x, y;

			// 横に連なっている所を描画
			for( j = 0; j < 80; j++ ){
				y = j * 12;
				for( i = 0; i < 80; ){
					if( wave_data[i][j] >= 0 ){
						for( k = i + 1; k < 80; k++ ){
							if( wave_data[k][j] != wave_data[i][j] ) break;
						}
						if( k - i > 1 ){
							setCMYColor( wave_data[i][j] );
							fillRect( i * 12, y, 12 * (k - i), 12 );
							for( ; i < k; i++ ){
								draw_data[i][j] = -1;
							}
						} else {
							draw_data[i][j] = wave_data[i][j];
							i++;
						}
					} else {
						draw_data[i][j] = -1;
						i++;
					}
				}
			}

			// 縦に連なっている所を描画
			for( i = 0; i < 80; i++ ){
				x = i * 12;
				for( j = 0; j < 80; ){
					if( draw_data[i][j] >= 0 ){
						for( k = j + 1; k < 80; k++ ){
							if( draw_data[i][k] != draw_data[i][j] ) break;
						}
						if( k - j > 1 ){
							setCMYColor( draw_data[i][j] );
							fillRect( x, j * 12, 12, 12 * (k - j) );
							for( ; j < k; j++ ){
								draw_data[i][j] = -1;
							}
						} else {
							j++;
						}
					} else {
						j++;
					}
				}
			}

			// 残った所を描画
			for( j = 0; j < 80; j++ ){
				y = j * 12;
				for( i = 0; i < 80; i++ ){
					if( draw_data[i][j] >= 0 ){
						setCMYColor( draw_data[i][j] );
						fillRect( i * 12, y, 12, 12 );
					}
				}
			}
		}
	}

	/**
	 * リング
	 */
	class Ring extends Object {
		int _x, _y;			// 中心位置
		int _col;			// ウェーブの色
		int _elapse = 0;	// 経過時間
		Ring( int x, int y, int col ){ _x = x; _y = y; _col = col; }
		public int x(){ return _x; }
		public int y(){ return _y; }
		public int col(){ return _col; }
		public int elapse(){ return _elapse; }
		public void update(){ _elapse++; }
	}

	/**
	 * 弾リスト
	 */
	class Shots {
		Vector shot;	// 弾情報
#ifdef SHOT_IMAGE
		MediaImage _mimg;
		Image _img;
#endif // SHOT_IMAGE

		/**
		 * コンストラクタ
		 */
		Shots(){
#ifdef SHOT_IMAGE
			try {
				_mimg = MediaManager.getImage( "resource:///shot.gif" );
				_mimg.use();
				_img = _mimg.getImage();
			} catch( Exception e ){
			}
#endif // SHOT_IMAGE
			shot = new Vector();
		}

		/**
		 * 構築
		 */
		public void create(){
			shot.removeAllElements();
			System.gc();
		}

		/**
		 * 弾を登録する
		 */
		public void add_shot( int x0, int y0, int x1, int y1 ){
			shot.addElement( new Shot( x0, y0, x1, y1 ) );
		}

		/**
		 * 弾を更新する
		 */
		public void update(){
			for( int i = shot.size() - 1; i >= 0; i-- ){
				Shot tmp = (Shot)shot.elementAt( i );
				tmp.update();

				// 座標判定
				int x = tmp.x();
				int y = tmp.y();
				if( x <= -12 || x >= 960 || y <= -12 || y >= 960 ){
					shot.removeElementAt( i );
					System.gc();
				} else if( stage.kabe12( (x + 6) / 12, (y + 6) / 12 ) ){
					shot.removeElementAt( i );
					System.gc();
				}
			}
		}

		/**
		 * 当たり判定
		 */
		public boolean hit(){
			boolean _hit = false;
			int x = jiki.x() + 6;
			int y = jiki.y() + 6;
			for( int i = shot.size() - 1; i >= 0; i-- ){
				Shot tmp = (Shot)shot.elementAt( i );
				if( (Math.abs( tmp.x() - x ) < 12) && (Math.abs( tmp.y() - y ) < 12) ){
					_hit = true;
					shot.removeElementAt( i );
					System.gc();
				}
			}
			return _hit;
		}

		/**
		 * 描画
		 */
		public void draw(){
#ifndef SHOT_IMAGE
			g.setColor( COLOR_W );
#endif // SHOT_IMAGE
			for( int i = shot.size() - 1; i >= 0; i-- ){
				Shot tmp = (Shot)shot.elementAt( i );
#ifdef SHOT_IMAGE
				drawImage( _img, tmp.x() + 1, tmp.y() + 1, 10, 10 );
#else
				fillRect( tmp.x() + 1, tmp.y() + 1, 10, 10 );
#endif // SHOT_IMAGE
			}
		}
	}

	/**
	 * 弾
	 */
	class Shot extends Object {
		int _x0, _y0;		// 発射位置
		int _x1, _y1;		// 目標位置
		int _x, _y;			// 現在位置
		int _elapse = 0;	// 経過時間
		Shot( int x0, int y0, int x1, int y1 ){ _x0 = x0; _y0 = y0; _x1 = x1; _y1 = y1; _x = _x0; _y = _y0; }
		public int x(){ return _x; }
		public int y(){ return _y; }
		public void update(){
			_elapse += SHOT_MOVE;

			int i;
			int e;
			int dx, dy, sx, sy;
			int w, h;
			int d = _elapse * _elapse;
			sx = (_x1 > _x0) ? 1 : -1;
			dx = (_x1 > _x0) ? _x1 - _x0 : _x0 - _x1;
			sy = (_y1 > _y0) ? 1 : -1;
			dy = (_y1 > _y0) ? _y1 - _y0 : _y0 - _y1;
			_x = _x0;
			_y = _y0;
			if( dx >= dy ){
				e = -dx;
				for( i = 0; i <= _elapse; i++ ){
					_x += sx;
					e += 2 * dy;
					if( e >= 0 ){
						_y += sy;
						e -= 2 * dx;
					}
					w = _x - _x0;
					h = _y - _y0;
					if( (w * w + h * h) >= d ){
						// 目標距離に達すると抜ける(水平垂直に飛ぶ弾も斜めに飛ぶ弾も速度が一定になる)
						break;
					}
				}
			} else {
				e = -dy;
				for( i = 0; i <= _elapse; i++ ){
					_y += sy;
					e += 2 * dx;
					if( e >= 0 ){
						_x += sx;
						e -= 2 * dy;
					}
					w = _x - _x0;
					h = _y - _y0;
					if( (w * w + h * h) >= d ){
						// 目標距離に達すると抜ける(水平垂直に飛ぶ弾も斜めに飛ぶ弾も速度が一定になる)
						break;
					}
				}
			}
		}
	}

	/**
	 * 敵
	 */
	class Enemy extends Object {
		int _type;					// 種類
		int _attack;				// 攻撃の種類
		int _w;						// 大きさ
		int _x, _y;					// 位置
		int _tx, _ty;				// ターゲット位置
		int _sx, _sy;				// 槍の先端
		int _interval;				// ウェーブを発する間隔
		int _shed;					// ウェーブを発する時間
		int _damage = 0, m_damage;	// ダメージ
		int _elapse = 0;			// 経過時間
		int _col_rand = -1;			// ウェーブの色
		int _direction;
		int _pattern;
		boolean _show;
		Enemy( int x, int y, int type, int interval, int shed, int damage ){
			if( type < 4 ){
				_type = ENEMY_0;
				_attack = type;
				_w = 32;
			} else {
				switch( (type - 4) / 4 ){
				case 0: _type = ENEMY_1; _attack = SHOT_DIRECTION; _w = 26; break;
				case 1: _type = ENEMY_2; _attack = SHOT_TARGET   ; _w = 34; break;
				case 2: _type = ENEMY_3; _attack = SHOT_TARGET   ; _w = 26; break;
				case 3: _type = ENEMY_4; _attack = SHOT_CIRCLE   ; _w = 32; break;
				case 4: _type = ENEMY_5; _attack = SHOT_CIRCLE   ; _w = 34; break;
				case 5: _type = ENEMY_6; _attack = TOUCH         ; _w = 26; break;
				}
			}
			_x        = x;
			_y        = y;
			_interval = interval;
			_shed     = shed;
			m_damage  = damage;
			switch( _type ){
			case ENEMY_1:
			case ENEMY_2:
			case ENEMY_3:
				switch( (type - 4) % 4 ){
				case 0: _direction = DIRECTION_D; _pattern = 0; break;
				case 1: _direction = DIRECTION_L; _pattern = 4; break;
				case 2: _direction = DIRECTION_R; _pattern = 4; break;
				case 3: _direction = DIRECTION_U; _pattern = 0; break;
				}
				break;
			case ENEMY_5:
				_pattern = 0;
				switch( (type - 4) % 4 ){
				case 0: _direction = DIRECTION_LD; break;
				case 1: _direction = DIRECTION_LU; break;
				case 2: _direction = DIRECTION_RD; break;
				case 3: _direction = DIRECTION_RU; break;
				}
				break;
			case ENEMY_6:
				spear();
				_pattern = 0;
				break;
			}
			_show = false;
		}
		public int x(){ return _x; }
		public int y(){ return _y; }
		public int spear_x(){ return _sx; }
		public int spear_y(){ return _sy; }
		public int elapse(){ return _elapse; }
		public int max_damage(){ return m_damage; }
		public void damage( int cnt ){ _damage += cnt; if( _damage >= m_damage ) _elapse = 0; }
		public boolean destroyed(){ return (_damage < m_damage) ? false : true; }
		private void move( int w, boolean target ){
			if( target ){
				int _cx = _x;
				int _cy = _y;
				int i;
				int e;
				int dx, dy, sx, sy;
				int _w = 0, _h = 0;
				int d = w * w;
				sx = (_tx > _cx) ? 1 : -1;
				dx = (_tx > _cx) ? _tx - _cx : _cx - _tx;
				sy = (_ty > _cy) ? 1 : -1;
				dy = (_ty > _cy) ? _ty - _cy : _cy - _ty;
				_x = _cx;
				_y = _cy;
				if( dx >= dy ){
					e = -dx;
					for( i = 0; i <= w; i++ ){
						_x += sx;
						e += 2 * dy;
						if( e >= 0 ){
							_y += sy;
							e -= 2 * dx;
						}
						_w = _x - _cx;
						_h = _y - _cy;
						if( (_w * _w + _h * _h) >= d ){
							// 目標距離に達すると抜ける
							break;
						}
					}
				} else {
					e = -dy;
					for( i = 0; i <= w; i++ ){
						_y += sy;
						e += 2 * dx;
						if( e >= 0 ){
							_x += sx;
							e -= 2 * dy;
						}
						_w = _x - _cx;
						_h = _y - _cy;
						if( (_w * _w + _h * _h) >= d ){
							// 目標距離に達すると抜ける
							break;
						}
					}
				}
				_tx += _w;
				_ty += _h;
			} else {
				switch( _direction ){
				case DIRECTION_D : _y += w; _pattern--; if( _pattern < 0 ) _pattern = 0; break;
				case DIRECTION_L : _x -= w; _pattern++; if( _pattern > 4 ) _pattern = 4; break;
				case DIRECTION_R : _x += w; _pattern++; if( _pattern > 4 ) _pattern = 4; break;
				case DIRECTION_U : _y -= w; _pattern--; if( _pattern < 0 ) _pattern = 0; break;
				case DIRECTION_LD: _x -= w; _y += w; break;
				case DIRECTION_LU: _x -= w; _y -= w; break;
				case DIRECTION_RD: _x += w; _y += w; break;
				case DIRECTION_RU: _x += w; _y -= w; break;
				}
			}
		}
		private void spear(){
			int _x0 = _x + 12;
			int _y0 = _y + 12;
			int _x1 = jiki.x() + 12;
			int _y1 = jiki.y() + 12;

			int i;
			int e;
			int dx, dy, sx, sy;
			int w, h;
			int d = 20 * 20;
			sx = (_x1 > _x0) ? 1 : -1;
			dx = (_x1 > _x0) ? _x1 - _x0 : _x0 - _x1;
			sy = (_y1 > _y0) ? 1 : -1;
			dy = (_y1 > _y0) ? _y1 - _y0 : _y0 - _y1;
			_sx = _x0;
			_sy = _y0;
			if( dx >= dy ){
				e = -dx;
				for( i = 0; i <= 20; i++ ){
					_sx += sx;
					e += 2 * dy;
					if( e >= 0 ){
						_sy += sy;
						e -= 2 * dx;
					}
					w = _sx - _x0;
					h = _sy - _y0;
					if( (w * w + h * h) >= d ){
						// 目標距離に達すると抜ける
						break;
					}
				}
			} else {
				e = -dy;
				for( i = 0; i <= 20; i++ ){
					_sy += sy;
					e += 2 * dx;
					if( e >= 0 ){
						_sx += sx;
						e -= 2 * dy;
					}
					w = _sx - _x0;
					h = _sy - _y0;
					if( (w * w + h * h) >= d ){
						// 目標距離に達すると抜ける
						break;
					}
				}
			}
		}
		public int pattern(){ return _pattern; }
		public void show( boolean flag ){ _show = flag; }
		public boolean show(){ return _show; }
		public int type(){ return _type; }
		public int attack(){ return _attack; }
		public int w(){ return _w; }
		public void update( boolean stage_clear ){
			if( _damage >= m_damage ){
				// 時間だけは経過させる
				_elapse++;
			} else if( !stage_clear ){
				// 移動する
				if(
					(_type != ENEMY_0) && (_type != ENEMY_4) &&
					(_x >= stage.win_x() - 132) && (_x <= stage.win_x() + 324) &&
					(_y >= stage.win_y() - 132) && (_y <= stage.win_y() + 324)
				){
					int old_x = _x;
					int old_y = _y;
					switch( _type ){
					case ENEMY_1: move( ENEMY_MOVE1, false ); break;
					case ENEMY_2: move( ENEMY_MOVE2, false ); break;
					case ENEMY_3:
						if( (_elapse % 15) == 0 ){
							if( Math.abs( _x - jiki.x() ) > Math.abs( _y - jiki.y() ) ){
								if( _x > jiki.x() ) _direction = DIRECTION_L; else _direction = DIRECTION_R;
							} else {
								if( _y > jiki.y() ) _direction = DIRECTION_U; else _direction = DIRECTION_D;
							}
						}
						move( ENEMY_MOVE3, false );
						break;
					case ENEMY_5:
						if( (_elapse % 15) == 0 ){
							switch( _direction ){
							case DIRECTION_LD:
								switch( rand.nextInt() % 2 ){
								case -1: _direction = DIRECTION_LU; break;
								case  0: _direction = DIRECTION_RD; break;
								case  1: _direction = DIRECTION_RU; break;
								}
								break;
							case DIRECTION_LU:
								switch( rand.nextInt() % 2 ){
								case -1: _direction = DIRECTION_LD; break;
								case  0: _direction = DIRECTION_RD; break;
								case  1: _direction = DIRECTION_RU; break;
								}
								break;
							case DIRECTION_RD:
								switch( rand.nextInt() % 2 ){
								case -1: _direction = DIRECTION_LD; break;
								case  0: _direction = DIRECTION_LU; break;
								case  1: _direction = DIRECTION_RU; break;
								}
								break;
							case DIRECTION_RU:
								switch( rand.nextInt() % 2 ){
								case -1: _direction = DIRECTION_LD; break;
								case  0: _direction = DIRECTION_LU; break;
								case  1: _direction = DIRECTION_RD; break;
								}
								break;
							}
							break;
						}
						move( ENEMY_MOVE3, false );
						break;
					case ENEMY_6:
						if( (_elapse % 5) == 0 ){
							_tx = jiki.x();
							_ty = jiki.y();
						}
						move( ENEMY_MOVE3, true );
						break;
					}
					if( stage.hit( _x, _y ) == BASE_KABE ){
						// 元の位置に戻す
						_x = old_x;
						_y = old_y;

						// 方向転換
						switch( _type ){
						case ENEMY_1:
							switch( _direction ){
							case DIRECTION_D: _direction = DIRECTION_U; break;
							case DIRECTION_L: _direction = DIRECTION_R; break;
							case DIRECTION_R: _direction = DIRECTION_L; break;
							case DIRECTION_U: _direction = DIRECTION_D; break;
							}
							break;
						case ENEMY_2:
						case ENEMY_3:
							switch( _direction ){
							case DIRECTION_D:
								switch( rand.nextInt() % 2 ){
								case -1: _direction = DIRECTION_L; break;
								case  0: _direction = DIRECTION_R; break;
								case  1: _direction = DIRECTION_U; break;
								}
								break;
							case DIRECTION_L:
								switch( rand.nextInt() % 2 ){
								case -1: _direction = DIRECTION_D; break;
								case  0: _direction = DIRECTION_R; break;
								case  1: _direction = DIRECTION_U; break;
								}
								break;
							case DIRECTION_R:
								switch( rand.nextInt() % 2 ){
								case -1: _direction = DIRECTION_D; break;
								case  0: _direction = DIRECTION_L; break;
								case  1: _direction = DIRECTION_U; break;
								}
								break;
							case DIRECTION_U:
								switch( rand.nextInt() % 2 ){
								case -1: _direction = DIRECTION_D; break;
								case  0: _direction = DIRECTION_L; break;
								case  1: _direction = DIRECTION_R; break;
								}
								break;
							}
							break;
						case ENEMY_5:
							switch( _direction ){
							case DIRECTION_LD:
								switch( rand.nextInt() % 2 ){
								case -1: _direction = DIRECTION_LU; break;
								case  0: _direction = DIRECTION_RD; break;
								case  1: _direction = DIRECTION_RU; break;
								}
								break;
							case DIRECTION_LU:
								switch( rand.nextInt() % 2 ){
								case -1: _direction = DIRECTION_LD; break;
								case  0: _direction = DIRECTION_RD; break;
								case  1: _direction = DIRECTION_RU; break;
								}
								break;
							case DIRECTION_RD:
								switch( rand.nextInt() % 2 ){
								case -1: _direction = DIRECTION_LD; break;
								case  0: _direction = DIRECTION_LU; break;
								case  1: _direction = DIRECTION_RU; break;
								}
								break;
							case DIRECTION_RU:
								switch( rand.nextInt() % 2 ){
								case -1: _direction = DIRECTION_LD; break;
								case  0: _direction = DIRECTION_LU; break;
								case  1: _direction = DIRECTION_RD; break;
								}
								break;
							}
							break;
						case ENEMY_6:
							switch( rand.nextInt() % 3 ){
							case -2: _tx = _x - 960; _ty = _y; break;
							case -1: _tx = _x + 960; _ty = _y; break;
							case  0: _tx = _x + (_x - jiki.x()); _ty = _y + (_y - jiki.y()); break;
							case  1: _tx = _x; _ty = _y - 960; break;
							case  2: _tx = _x; _ty = _y + 960; break;
							}
							break;
						}
					}
					if( _type == ENEMY_6 ){
						spear();
					}
				}

				// 攻撃する
				if(
					((_elapse % _interval) == _shed) &&
					(_x >= stage.win_x() - 132) && (_x <= stage.win_x() + 324) &&
					(_y >= stage.win_y() - 132) && (_y <= stage.win_y() + 324)
				){
					switch( _attack ){
					case RING_C:
					case RING_M:
					case RING_Y:
						wave.add_ring( _x / 12 + 1, _y / 12 + 1, _attack );
						break;
					case RING_RANDOM:
						{
							int tmp = (rand.nextInt() % 2) + 1;
							if( tmp == _col_rand ){
								tmp++; if( tmp > 2 ) tmp = 0;
							}
							_col_rand = tmp;
							wave.add_ring( _x / 12 + 1, _y / 12 + 1, tmp );
						}
						break;
					case SHOT_DIRECTION:
						switch  ( _direction ){
						case DIRECTION_D: shots.add_shot( _x + 8, _y + 8, _x + 8, 960 ); break;
						case DIRECTION_L: shots.add_shot( _x + 8, _y + 8,   0, _y + 8 ); break;
						case DIRECTION_R: shots.add_shot( _x + 8, _y + 8, 960, _y + 8 ); break;
						case DIRECTION_U: shots.add_shot( _x + 8, _y + 8, _x + 8,   0 ); break;
						}
						break;
					case SHOT_TARGET:
						shots.add_shot( _x + 8, _y + 8, jiki.x() + 8, jiki.y() + 8 );
						break;
					case SHOT_CIRCLE:
						{
							for( int i = 0; i < 12; i++ ){
								shots.add_shot( _x + 8, _y + 8, _x + 8 + COS[i], _y + 8 + SIN[i] );
							}
						}
						break;
					}
				}

				_elapse++;
			}
		}
	}

	/**
	 * 自機
	 */
	class Jiki {
		int _x, _y;				// 位置
		int dsp_x, dsp_y;		// 描画位置
		int _light_x, _light_y;	// 照明の位置
		int pattern_x, pattern_y;
		int _mode;
		int _direction;
		int _barrier;
		int _damage, t_damage, m_damage;
		int _life;
		int _muteki;
		MediaImage _mimg;
		Image _img = null;

		/**
		 * コンストラクタ
		 */
		Jiki(){
			m_damage = WAIT_1 * JIKI_LIFE;
			init( true );
		}

		/**
		 * イメージ読み込み
		 */
		public void load_image(){
			if( _img != null ){
				_img.dispose();
				_mimg.dispose();
				_img = null;
			}
			try {
				switch( level ){
				case 0:
				case 1:
					_mimg = MediaManager.getImage( "resource:///jiki.gif" );
					break;
				case 2:
				case 3:
					_mimg = MediaManager.getImage( "resource:///jikip.gif" );
					break;
				case 4:
				case 5:
					_mimg = MediaManager.getImage( "resource:///jikim.gif" );
					break;
				case 6:
				case 7:
					_mimg = MediaManager.getImage( "resource:///jikid.gif" );
					break;
				}
				_mimg.use();
				_img = _mimg.getImage();
			} catch( Exception e ){
			}
		}

		/**
		 * 初期化
		 */
		public void init( boolean start ){
			if( start ){
				_life = JIKI_LIFE;
			} else {
				_life++;
				if( _life <= 0 ) _life = 1;
				if( _life > JIKI_LIFE ) _life = JIKI_LIFE;
			}
			t_damage = m_damage - (_life * WAIT_1);

			_x         = 468;
			_y         = 924;
			pattern_x  = 0;
			pattern_y  = 0;
			_mode      = BASE_NORMAL;
			_direction = DIRECTION_U;
			set_dsp();
			set_light( true );
			_barrier   = 0;
			_damage    = 0;
			_muteki    = 0;
		}

		/**
		 *
		 */
		private void set_dsp(){
			dsp_x = _x;
			dsp_y = _y;
			if( _mode == BASE_SLOW ){
				dsp_x += (rand.nextInt() % 3);
				dsp_y += (rand.nextInt() % 3);
			}
		}

		/**
		 *
		 */
		private void set_light( boolean force ){
			if( dark || force ){
				_light_x = dsp_x - 48;
				_light_y = dsp_y - 48;
				switch( _direction ){
				case DIRECTION_D: _light_y += 36; break;
				case DIRECTION_L: _light_x -= 36; break;
				case DIRECTION_R: _light_x += 36; break;
				case DIRECTION_U: _light_y -= 36; break;
				}
			}
		}

		/**
		 * 下移動
		 */
		public void down(){
			if( _damage > 0 ) return;
			_direction = DIRECTION_D;
			int old_y = _y;
			switch( _mode ){
			case BASE_NORMAL : _y += JIKI_MOVE2; break;
			case BASE_SLOW   : _y += JIKI_MOVE1; break;
			case BASE_INERTIA: _y += JIKI_MOVE2; break;
			}
			_mode = stage.hit( _x, _y );
			if( _mode == BASE_KABE ){
				_y = old_y + JIKI_MOVE1;
				_mode = stage.hit( _x, _y );
				if( _mode == BASE_KABE ){
					_y = old_y;
				}
			}
			set_dsp();
			set_light( false );
			pattern_x--; if( pattern_x < 0 ) pattern_x = 0;
			pattern_y++; if( pattern_y > 1 ) pattern_y = 0;
		}

		/**
		 * 左移動
		 */
		public void left(){
			if( _damage > 0 ) return;
			_direction = DIRECTION_L;
			int old_x = _x;
			switch( _mode ){
			case BASE_NORMAL : _x -= JIKI_MOVE2; break;
			case BASE_SLOW   : _x -= JIKI_MOVE1; break;
			case BASE_INERTIA: _x -= JIKI_MOVE2; break;
			}
			_mode = stage.hit( _x, _y );
			if( _mode == BASE_KABE ){
				_x = old_x - JIKI_MOVE1;
				_mode = stage.hit( _x, _y );
				if( _mode == BASE_KABE ){
					_x = old_x;
				}
			}
			set_dsp();
			set_light( false );
			pattern_x++; if( pattern_x > 4 ) pattern_x = 4;
			pattern_y++; if( pattern_y > 1 ) pattern_y = 0;
		}

		/**
		 * 右移動
		 */
		public void right(){
			if( _damage > 0 ) return;
			_direction = DIRECTION_R;
			int old_x = _x;
			switch( _mode ){
			case BASE_NORMAL : _x += JIKI_MOVE2; break;
			case BASE_SLOW   : _x += JIKI_MOVE1; break;
			case BASE_INERTIA: _x += JIKI_MOVE2; break;
			}
			_mode = stage.hit( _x, _y );
			if( _mode == BASE_KABE ){
				_x = old_x + JIKI_MOVE1;
				_mode = stage.hit( _x, _y );
				if( _mode == BASE_KABE ){
					_x = old_x;
				}
			}
			set_dsp();
			set_light( false );
			pattern_x++; if( pattern_x > 4 ) pattern_x = 4;
			pattern_y++; if( pattern_y > 1 ) pattern_y = 0;
		}

		/**
		 * 上移動
		 */
		public void up(){
			if( _damage > 0 ) return;
			_direction = DIRECTION_U;
			int old_y = _y;
			switch( _mode ){
			case BASE_NORMAL : _y -= JIKI_MOVE2; break;
			case BASE_SLOW   : _y -= JIKI_MOVE1; break;
			case BASE_INERTIA: _y -= JIKI_MOVE2; break;
			}
			_mode = stage.hit( _x, _y );
			if( _mode == BASE_KABE ){
				_y = old_y - JIKI_MOVE1;
				_mode = stage.hit( _x, _y );
				if( _mode == BASE_KABE ){
					_y = old_y;
				}
			}
			set_dsp();
			set_light( false );
			pattern_x--; if( pattern_x < 0 ) pattern_x = 0;
			pattern_y++; if( pattern_y > 1 ) pattern_y = 0;
		}

		/**
		 * 慣性移動
		 */
		public void inertia(){
			if( _mode == BASE_INERTIA ){
				switch( _direction ){
				case DIRECTION_D: down (); break;
				case DIRECTION_L: left (); break;
				case DIRECTION_R: right(); break;
				case DIRECTION_U: up   (); break;
				}
			}
		}

#ifdef DEBUG
		public void move( int off_x, int off_y ){
			_x += off_x;
			_y += off_y;
			if( _x <   0 ) _x =   0;
			if( _x > 936 ) _x = 936;
			if( _y <   0 ) _y =   0;
			if( _y > 936 ) _y = 936;
			dsp_x = _x;
			dsp_y = _y;
		}
#endif // DEBUG

		// バリアの状態を変更
		public void barrier( int col ){ _barrier = col; }

		// バリアの状態を確認
		public int barrier(){ return _barrier; }

		// ダメージを確認
		public int total_damage(){ return t_damage; }

		// ダメージ上限を確認
		public int max_damage(){ return m_damage; }

		// ライフを確認
		public int life(){ return (t_damage + (WAIT_1 - 1)) / WAIT_1; }

		// 破壊されたかどうか確認
		public boolean destroyed(){ return (t_damage < m_damage) ? false : true; }

		// 位置を確認
		public int x(){ return _x; }
		public int y(){ return _y; }

		// 照明の位置を確認
		public int light_x(){ return _light_x; }
		public int light_y(){ return _light_y; }

		/**
		 * ダメージのトリガー
		 */
		public void damage(){
			if( _muteki > 0 ) return;
			if( _damage == 0 ) _damage++;
		}

		/**
		 * 無敵のトリガー
		 */
		public void muteki(){
			_muteki = WAIT_2;
		}

		/**
		 * 描画
		 */
		public void draw( boolean pause ){
			// ダメージ中の場合...
			if( _damage > 0 ){
				if( _life > 0 ){
					drawImage( _img, dsp_x, dsp_y, pattern_x * 26, pattern_y * 26, 26, 26 );
					g.setColor( COLOR_W );
					for( int i = 0; i < 3; i++ ){
						drawLine(
							dsp_x + 12 + (rand.nextInt() % 13),
							dsp_y + 12 + (rand.nextInt() % 13),
							dsp_x + 12 + (rand.nextInt() % 13),
							dsp_y + 12 + (rand.nextInt() % 13)
							);
					}
					if( !pause ){
						_damage++;
						t_damage++;
						if( _damage > WAIT_1 ){
							_damage = 0;
							_life--; if( _life == 0 ) damage(); else muteki();
						}
					}
				} else {
					stage.baku( dsp_x, dsp_y, 99, _damage );
					if( !pause ) _damage++;
				}
				return;
			}

			// 無敵中の場合...
			if( !pause && (_muteki > 0) ){
				_muteki--;
				if( (_muteki % 2) > 0 ){
					drawImage( _img, dsp_x, dsp_y, pattern_x * 26, pattern_y * 26, 26, 26 );
				}
			} else {
				drawImage( _img, dsp_x, dsp_y, pattern_x * 26, pattern_y * 26, 26, 26 );
			}

			// バリアの表示
			setCMYColor( _barrier );
			drawRect(
				_x - 2 + (rand.nextInt() % 3),
				_y - 2 + (rand.nextInt() % 3),
				26,
				26
				);
		}
	}
}
