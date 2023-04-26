#!/bin/bash
#export PATH=/bin:/usr/bin:/usr/local/bin
#TODAY=`date +"%d%b%Y"`
# Backup filelar saqlanadigan joy
backupfolder=/backup/psql
# backupni saqlash muddati va saqlaydigan filelarni o'zgaruvchilar qilib yaratib olindi
keep_day=30
sqlfile=$backupfolder/all-databases-$(date +%d-%m-%Y_%H-%M-%S).sql
zipfile=$backupfolder/all-databases-$(date +%d-%m-%Y_%H-%M-%S).zip
#backup folder yaratib olamiz
mkdir -p $backupfolder
# backup olinadi pg_dumpall commandasi bilan bu barcha databasalardan backup oladi
if pg_dumpall -U postgres > $sqlfile ; then
   echo 'Sql dump created'
else
   echo 'pg_dump return non-zero code'
   exit
fi
# backup file siqilib zip holatga keltiriladi chunki kop joy egallashi mumkin
if gzip $sqlfile > $zipfile; then
   echo 'The backup was successfully compressed'
else
   echo 'Error compressing backup'
   exit
fi
rm -rf $sqlfile
echo $zipfile

# Va yuqorida korsatilgan kun boyicha eski backup filelarni ochirib tashlaydi
find $backupfolder -mtime +$keep_day -delete
