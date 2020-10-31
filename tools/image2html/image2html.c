#include <stdio.h>
#include <string.h>

char* progName( char* argv0 )
{
	char* szTop;
	char* szTmp;
	szTop = argv0;
	if( (szTmp = strrchr( szTop, '\\' )) != NULL )
	{
		szTop = szTmp + 1;
	}
	if( (szTmp = strrchr( szTop, '.' )) != NULL )
	{
		*szTmp = '\0';
	}
	return strlwr( szTop );
}

char* fgets2( char* buf, int len, FILE* fp )
{
	char* tmp = fgets( buf, len, fp );
	if( tmp != NULL )
	{
		/* 行末の改行コードを取り除く */
		char* szTmp = tmp;
		while( (*szTmp != '\r') && (*szTmp != '\n') && (*szTmp != '\0') )
		{
			szTmp++;
		}
		*szTmp = '\0';
	}
	return tmp;
}

int main( int argc, char* argv[] )
{
	FILE* fp;
	FILE* fp2;
	FILE* fp3;
	int num;
	char tmp[256 + 1];
	char* szTmp;
	char* szTop;
	char* szEnd;

	if( argc < 5 )
	{
		printf( "usage: %s <in_list_file> <top_str> <out_js> <out_html>\n", progName( argv[0] ) );
		return 0;
	}

	if( (fp = fopen( argv[1], "rt" )) != NULL )
	{
		if( (fp2 = fopen( argv[3], "w+t" )) != NULL )
		{
			if( (fp3 = fopen( argv[4], "w+t" )) != NULL )
			{
				num = 0;
				while( fgets2( tmp, 256, fp ) != NULL )
				{
					if( strncmp( tmp, argv[2], strlen( argv[2] ) ) == 0 )
					{
						szTop = &tmp[strlen( argv[2] )];
					}
					else
					{
						szTop = tmp;
					}
					if( (szEnd = strstr( szTop, ".gif" )) == NULL )
					{
						if( (szEnd = strstr( szTop, ".jpg" )) == NULL )
						{
							szEnd = strstr( szTop, ".png" );
						}
					}
					if( szEnd != NULL )
					{
						fprintf( fp3, "<img id=\"RES_IMAGE_%d\" src=\"%s\" style=\"display:none\" />\n", num, tmp );

						while( (szTmp = strrchr( szTop, '/' )) != NULL )
						{
							*szTmp = '_';
						}
						*szEnd = '\0';
						fprintf( fp2, "var RES_IMAGE_%s\t= %d;\n", strupr( szTop ), num );

						num++;
					}
				}
				fprintf( fp2, "var RES_IMAGE_NUM\t= %d;\n", num );
				fclose( fp3 );
			}
			fclose( fp2 );
		}
		fclose( fp );
	}

	return 0;
}
