#!/bin/bash

#./deploy-stack.sh elltdev

if [ "$#" -ne 1 ]; then
	echo "usage: deploy-stack.sh (프로파일명)"
	exit 0
fi

baseName=$(basename $(pwd))

#배포 SAM 파일명
deployFile=$baseName'_'$1'.yaml'

#배포용 버킷명
bucketName=$1'.lambda.lotte.net'

#CloudFormation 스택명
stackName=$baseName'-STACK'

#cloudformation 배포하기 
#package
aws cloudformation package --template-file ./deploy/$deployFile --output-template-file serverless-output.yaml \
   --s3-bucket $bucketName --region ap-northeast-2 \
   --profile $1

#deploy
aws cloudformation deploy --template-file ./serverless-output.yaml \
   --stack-name $stackName --region ap-northeast-2 \
   --profile $1
