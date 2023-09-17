1. Reco4는 SIFT방식(컴퓨터비전)인데  npm install opencv.js 하니 메모리누수발생으로 인해 사용할거면 다른 방식 사용하기
   (예를들면 알고리즘을 직접 구현하거나, openCv가 아닌 다른데에서 sift방식을 지원하는 걸 설치하거나)
2. Reco5는 모델파일을 사용한 유클리디안 거리!
3. Reco6은 모델파일을 사용한 ssim(구조적유사성) import * as tfjs from '@tensorflow/tfjs-image'설치에 문제가 있어 사용못함.
   npm에 존재한다는데 다운이 안됨 공식문서에도 딱히 안보임 근데 저걸 써야된다함 ㅇ걍 노답~
