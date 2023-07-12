# Aurora Service
Service는 Client와 Agent사이에 위치하여, 사용자가 원활하게 모니터링을 할 수 있도록 돕는 서비스입니다.

# 사용기술
* NestJS
  * API Gateway, Service(Backend)를 개발할 때 사용했습니다. NestJS는 TypeScript 기반의 Node.js 프레임워크로, 유연성과 확장성이 뛰어난 프로그래밍 언어 입니다. 프로젝트의 유연한 구조와 확장성을 위해 사용했습니다.
* MSA(Microservice Architecture)
  * MSA(Microservice Architecture)를 활용하여 API Gateway와 Service(Microservice)의 구조를 구현했습니다. Client의 요청은 API Gateway를 통해 들어오며, API Gateway는 이 요청을 적절한 Service(Microservice)로 전달합니다.
  * 서비스의 독립성과 확장성을 향상시키기 위해 사용했습니다.
* WebSocket
  * Client와 Agent 사이에서 실시간으로 데이터를 주고 받기 위해 사용했습니다. Agent가 수집한 정보를 Client의 요청에 따라 실시간으로 전송하도록 구현하였습니다.
