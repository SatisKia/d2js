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
	register int i;
	FILE* fp;
	FILE* fp2;
	char tmp[1024 + 1];
	char tmp2[256 + 1];

	if( argc < 3 )
	{
		printf( "usage: %s <in_file> <out_html>\n", progName( argv[0] ) );
		return 0;
	}

	if( (fp = fopen( argv[1], "rt" )) != NULL )
	{
		if( (fp2 = fopen( argv[2], "w+t" )) != NULL )
		{
			while( fgets2( tmp, 1024, fp ) != NULL )
			{
				tmp2[0] = '\0';
				for( i = 0; ; i++ )
				{
					if( tmp[i] == '\0' )
					{
						break;
					}
					if( tmp[i] == '\t' )
					{
						strcpy( tmp2, &tmp[i + 1] );
						tmp[i] = '\0';
						break;
					}
				}

				if( tmp2[0] != '\0' )
				{
					fprintf( fp2, "<span id=\"%s\" style=\"display:none\">", tmp2 );
					for( i = 0; ; i++ )
					{
						if( tmp[i] == '\0' )
						{
							break;
						}
						switch( tmp[i] )
						{
						case '<':
							fprintf( fp2, "&lt;" );
							break;
						case '>':
							fprintf( fp2, "&gt;" );
							break;
						case '&':
							fprintf( fp2, "&amp;" );
							break;
						case '"':
							fprintf( fp2, "&quot;" );
							break;
						default:
							fputc( tmp[i], fp2 );
							break;
						}
					}
					fprintf( fp2, "</span>\n" );
				}
			}
			fclose( fp2 );
		}
		fclose( fp );
	}

	return 0;
}
