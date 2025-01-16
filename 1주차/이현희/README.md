# JavaScript & React 공부

- JavaScript와 React를 강의를 들으며 공부하고, 그 내용을 개발블로그에 기록하였습니다.
- 블로그 주소 : https://birdsfoot.tistory.com/
  - 한 번에 올리기엔 양이 많아서 주제별로 나눠서 예약발행 해두었습니다.

<br>

### 예약 발행한 글

<hr>

![예약발행글1](assets/예약발행글%20리스트1.png)  
![예약발행글2](assets/예약발행글%20리스트2.png)

<hr>

<br>
<br>
<br>

## useState와 이벤트핸들링 실습

- 강의를 보며 useState와 이벤트 핸들링을 통해 회원가입에 필요한 input 데이터를 활용하는 실습을 했습니다.

<br>

```javascript
//App.jsx
import "./App.css";
import Register from "./components/Register";

function App() {
  return (
    <>
      <Register />
    </>
  );
}

export default App;
```

```javascript
//Register.jsx
import { useState } from "react";

const Register = () => {
  const [input, setInput] = useState({
    name: "",
    birth: "",
    country: "",
    bio: "",
  });

  console.log(input);

  const onChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div>
        <input
          name="name"
          value={input.name}
          onChange={onChange}
          placeholder={"이름"}
        />
      </div>
      <div>
        <input
          name="birth"
          value={input.birth}
          onChange={onChange}
          type="date"
        />
      </div>
      <div>
        <select name="country" onChange={onChange} value={input.country}>
          <option></option>
          <option value="kr">한국</option>
          <option>영국</option>
          <option>미국</option>
        </select>
      </div>
      <div>
        <textarea name="bio" onChange={onChange} value={input.bio}></textarea>
      </div>
    </div>
  );
};

export default Register;
```

<hr>

<br>
<br>
<br>

# 프로젝트 관련 지식 공부

## 명세서

명세서를 처음부터 끝까지 꼼꼼히 정독했습니다.

<br>

## 웹소켓(WebSocket)

- 클라이언트와 서버가 자유롭게 메시지를 주고받을 수 있는 양방향 통신

- WebSocket 통신은 HTTP 요청으로 연결을 시작하고, 연결이 완료되면 WebSocket 프로토콜로 전환됨.

- 장점 : WebSocket은 적은 오버헤드로 효율적인 통신을 가능하게 하며, 실시간 업데이트가 필요한 서비스에 적합

- 단점 : 서버 설계의 복잡성, 로드 밸런싱, 메시지 크기 제한, 보안 문제 등

## 웹 RTC

- 웹 RTC에 대해 공부하고 Open Vidu를 찾아보았습니다.

- 리액트 오픈비두 공식 페이지
  - https://openvidu.io/latest/docs/tutorials/application-client/react/#4-run-the-client-application
- 오픈비두 튜토리얼

  - https://www.youtube.com/watch?v=-0iOV3CQCk8

- 참고자료
  - https://hwanheejung.tistory.com/47
  - https://velog.io/@ttaho/Openvidu-Openvidu-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0
  <hr>

## 디자인 레퍼런스 탐색

- 노션에 정리해 두었습니다
https://bottlenose-twist-ec3.notion.site/177b7e3f38b8804f9ac8c9802931da7d?pvs=4

  <br>
  <br>
  <br>

# Figma

- 인프런에서 강의를 듣고 있습니다
  <br>
  ![인프런강의](assets/인프런%20강의.png)

<br>
<br>

- 강의를 듣고 혼자 열쇠구멍 아이콘을 만들며 단축키를 익히고 아이콘 마무리, export를 연습해보았습니다.

<br>

![피그마연습 - 열쇠구멍](assets/피그마연습%20-%20열쇠구멍.png)

<br>
<br>

- 디자인을 구상하며 목업을 만들어봤는데, 어째서인지 맨 위에 컴포넌트가 혼자 색이 어둡습니다.
- 머리속에 있는 걸 그대로 표현할 만큼 아직 실력이 좋진 않아 답답합니다.
- 디자인은 매우 마음에 안들지만 그래도 좋은 연습이었습니다.  
<br>
![피그마연습 - 목업](assets/피그마연습%20-%20목업.png)
<hr>

<br>
<br>
<br>

# 아이디어

- 생각을 정리하고, 팀원들에게 아이디어를 잘 설명하기 위해 아이디어 기획안을 노션에 작성하였습니다.
- 초기 기획안 주소 : https://bottlenose-twist-ec3.notion.site/174b7e3f38b880e889e9ea3b64017cb4?pvs=4
- 다행히 제 아이디어가 잘 전달이 되어 팀 최종 주제로 선정되었습니다.
