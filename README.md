# 사용 스택

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Styled Components](https://img.shields.io/badge/styled_components-DB7093.svg?style=for-the-badge&logo=styled-components&logoColor=white)


## Start project

Install

```
npm install
```

Start

```
npm run start
```

<br/><br/>

## 구현된 사항

- 마우스를 드래그해서 사각형, 원을 그릴 수 있습니다.
  Rect, Circle 버튼을 클릭한 후 사각형과 원을 그릴 수 있습니다.

- 도형을 선택해서 삭제할 수 있습니다.
  Rect or Circle 버튼이 선택되어 있으면 도형을 선택할 수 없습니다.
  다시 한번 선택하여 해제하거나 Select 버튼을 선택 후 도형을 선택 후 Remove 클릭으로 도형을 삭제할 수 있습니다.

- 모든 도형을 일괄 삭제할 수 있습니다.
  Clear 버튼 선택시 모든 도형을 일괄 삭제할 수 있습니다.

- 도형을 선택한 후 드래그로 위치를 바꿀 수 있습니다.

- 그려진 도형은 Client-side storage에 저장되어 페이지를 새로고침 해도 유지되어야 합니다.



## 보완할 부분

- 도형을 선택 후 드래그로 위치를 바꿀 수 있으나 선택된 도형 밖으로 마우스 커서 이동시 움직일 수 없습니다.
- Rect, Circle 선택시 도형을 선택할 수 없습니다.
- 드래그하여 영역안의 여러 도형을 선택할 수 있습니다.
