#!/bin/bash

#
# scan.sh
#

#TODO something with otf|ttf|xpgt|ncx|mimetype|plist|db|eg|thmx|bak|DS_Store|iTunesArtwork|dfont|ttc

set -e
trap 'echo "ERROR: $BASH_SOURCE:$LINENO $BASH_COMMAND" >&2' ERR
TMP="no.no"
function finalize {
	rm -r "$TMP"
}
trap finalize EXIT
TMPDIR=/dev/shm
export TMPDIR
TMP_MAX="$(grep MemAvailable /proc/meminfo \
	| perl -pe 's/ kB/000/g;s/.* //g')"
TMP_MAX="$(echo "$TMP_MAX/2" | bc)"
doScan () {
	FIRST=true
	O="$(find . -type f \
		| perl -pe 's/.*[\.\/]//g' \
		| sort -u \
		| grep -viP "^(txt|html|htm|xhtml|xml|opf|css|svg|html_split_.*)$" \
		| grep -viP "^(jpg|jpeg|png|gif)$" \
		| grep -viP "^(otf|ttf|xpgt|ncx|mimetype|plist|db|eg|thmx|bak|DS_Store|iTunesArtwork|dfont|ttc)$" \
		|| true)"
	if [ "$O" != "" ] ; then
		if $FIRST ; then
			echo "$1"
				echo -e "\tln: $2"
			FIRST=false
		fi
		echo "$O" | perl -pe 's/^/\t/g'
	fi
	while read -r F ; do
		T="$(file "$F" | grep -vP "(ASCII|Unicode)( \(with BOM\))? text|XML( [0-9.]+)? document|HTML document|SVG" || true)"
		if [ "$T" != "" ] ; then
			if $FIRST ; then
				echo "$1"
				echo -e "\tln: $2"
				FIRST=false
			fi
			echo -e "\t$F"
			echo "$T" | perl -pe 's/^/\t\t/g'
		fi
	done < <(find . -type f \
		| grep -iP "\\.(txt|html|htm|xhtml|xml|opf|css|svg|html_split_.*)$" || true)
	while read -r F ; do
		T="$(file "$F" | grep -vP "image data" || true)"
		if [ "$T" != "" ] ; then
			if $FIRST ; then
				echo "$1"
				echo -e "\tln: $2"
				FIRST=false
			fi
			echo -e "\t$F"
			echo "$T" | perl -pe 's/^/\t\t/g'
		fi
	done < <(find . -type f \
		| grep -iP "\\.(jpg|jpeg|png|gif)$" || true)
	while read -r F ; do
		O="$(grep -iP "<script|([^a-z]|^)on[a-z]+\\s*=|src\\s*=[^<>]http|<[^<>]*data:" "$F" || true)"
		if [ "$O" != "" ] ; then
			if $FIRST ; then
				echo "$1"
				echo -e "\tln: $2"
				FIRST=false
			fi
			echo -e "\t$F"
			while read -r L ; do
				echo "$L" \
					| perl -pe 's/(<[^\/][^<>]*>)/\n$1/g' \
					| perl -pe 's/(<\/[^<>]*>)/$1\n/g' \
					| grep --color=always -iP "<script|([^a-z]|^)on[a-z]+\\s*=|src\\s*=[^<>]http|data:" \
					| perl -pe 's/^/\t\t/g;
						s/^(.{999}).*/$1.../g'
			done < <(echo "$O")
		fi
	done < <(find . -type f \
		| grep -iP "\\.(.*htm.*|svg)" || true)
	while read -r F ; do
		O="$(grep -iP "url\\s*\\(\\s*http" "$F" || true)"
		if [ "$O" != "" ] ; then
			if $FIRST ; then
				echo "$1"
				echo -e "\tln: $2"
				FIRST=false
			fi
			echo "$O" | perl -pe 's/^/\t/g'
		fi
	done < <(find . -type f -iname '*.css')
}
MP="$(pwd)"
while read -r ZIP ; do
	B="$(du -b "$ZIP" | perl -pe 's/\t.*//g')"
	if [ "$B" -gt "$TMP_MAX" ] ; then
		echo "To big $ZIP"
		continue
	fi
	H="$(stat -c %h "$ZIP")"
	TMP="$(mktemp -d)"
	(
		cd "$TMP"
		SHOULDSCAN=true
		7z x "$MP/$ZIP" > /dev/null || SHOULDSCAN=false
		if $SHOULDSCAN ; then
			doScan "$ZIP" "$H"
		else
			echo "Invalid $ZIP"
		fi
	)
	rm -r "$TMP"
done < <(find . -iname '*.epub')
