#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Error: no source path given"
    exit
fi
if [ $# -gt 0 ]; then
    src_dir=$1
    name="$(basename -- "$src_dir")"
    dst_dir=$PWD
fi
if [ $# -gt 1 ]; then
    dst_dir=$2
fi
if [ $# -gt 2 ]; then
    echo "Warning: extra arguments are ignored"
fi

if [ ! -d $src_dir ]; then
    echo "Error: directory '$src_dir' does not exist"
    exit
fi

if [ ! -d $dst_dir ]; then
    echo "Error: directory '$dst_dir' does not exist"
    exit
fi

pwd=$PWD
cd $src_dir
zip -X0 $dst_dir/$name.zip mimetype
zip -Xr --symlinks $dst_dir/$name.zip META-INF EPUB
mv $dst_dir/$name.zip $dst_dir/$name.epub
cd $pwd

for dir in ./*/; do
    if [[ $dir =~ epubcheck-[0-9.]+ ]]; then
        epubcheck_dir=$dir
        break
    fi
done

if [ -f $epubcheck_dir/epubcheck.jar ]; then
    java -jar $epubcheck_dir/epubcheck.jar $dst_dir/$name.epub
else
    echo "Warning: could not find epubcheck.jar"
fi

exit
