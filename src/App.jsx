import React, { useEffect, useRef } from "react";

import { HashRouter as Router, Switch, Route } from "react-router-dom";

import { RecoilRoot, atom, useRecoilState } from "recoil";

import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// 라이브러리
import Swiper from "swiper";
import "swiper/css/bundle";

// 커스텀
function App() {
  return (
    <RecoilRoot>
      <RecoilApp />
    </RecoilRoot>
  );
}

const RecoilApp = () => {
  return (
    <Router>
      <Switch>
        <Route path="/wish/add" component={WishAddPage} />
        <Route path="/home/main" component={HomeMainPage} />
        <Route path="/home/howTo" component={HomeHowToPage} />
        <Route path="/" component={HomeSplashPage} />
      </Switch>
    </Router>
  );
};

const appRunCountAtom = atom({
  key: "app/appRunCount",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

const wishesAtom = atom({
  key: "app/wishes",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

const useWishesStatus = () => {
  const [wishes, setWishes] = useRecoilState(wishesAtom);

  const addWish = (title) => {
    setWishes((wishes) => {
      const id = wishes.length + 1;
      const regDate = getNowDateStr();
      const newWish = {
        id,
        regDate,
        title,
      };

      return [...wishes, newWish];
    });
  };

  const addNewWishes = (titles) => {
    deleteWishes();

    titles.forEach((title) => addWish(title));
  };

  const deleteWishes = () => {
    setWishes(() => []);
  };

  return {
    wishes,
    addNewWishes,
    deleteWishes,
  };
};

const WishAddPage = ({ history }) => {
  const { wishes, addNewWishes } = useWishesStatus();

  const n1WishTextareaRef = useRef();
  const n2WishTextareaRef = useRef();
  const n3WishTextareaRef = useRef();

  useEffect(() => {
    const n1WishTextarea = n1WishTextareaRef.current;
    const n2WishTextarea = n2WishTextareaRef.current;
    const n3WishTextarea = n3WishTextareaRef.current;

    if (wishes[0]) {
      n1WishTextarea.value = wishes[0].title;
    }

    if (wishes[1]) {
      n2WishTextarea.value = wishes[1].title;
    }

    if (wishes[2]) {
      n3WishTextarea.value = wishes[2].title;
    }
  }, [wishes]);

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const n1WishTextarea = n1WishTextareaRef.current;
    const n2WishTextarea = n2WishTextareaRef.current;
    const n3WishTextarea = n3WishTextareaRef.current;

    n1WishTextarea.value = n1WishTextarea.value.trim();

    if (n1WishTextarea.value.length == 0) {
      alert("첫번째 소원을 입력해주세요.");
      n1WishTextarea.focus();
      return;
    }

    n2WishTextarea.value = n2WishTextarea.value.trim();

    if (n2WishTextarea.value.length == 0) {
      alert("두번째 소원을 입력해주세요.");
      n2WishTextarea.focus();
      return;
    }

    n3WishTextarea.value = n3WishTextarea.value.trim();

    if (n3WishTextarea.value.length == 0) {
      alert("세번째 소원을 입력해주세요.");
      n3WishTextarea.focus();
      return;
    }

    addNewWishes([
      n1WishTextarea.value,
      n2WishTextarea.value,
      n3WishTextarea.value,
    ]);

    alert("소원이 등록되었습니다.");
    history.replace("/home/main");
  };

  const handleBtnCancelOnClick = () => {
    history.goBack();
  };

  return (
    <div className="min-h-screen px-3">
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">첫번째 소원</span>
          </label>
          <textarea
            ref={n1WishTextareaRef}
            autoFocus={true}
            className="textarea textarea-bordered textarea-primary"
            placeholder="첫번째 소원을 입력해주세요.(여러줄 가능)"
            rows="3"
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">두번째 소원</span>
          </label>
          <textarea
            ref={n2WishTextareaRef}
            className="textarea textarea-bordered textarea-primary"
            placeholder="두번째 소원을 입력해주세요.(여러줄 가능)"
            rows="3"
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">세번째 소원</span>
          </label>
          <textarea
            ref={n3WishTextareaRef}
            className="textarea textarea-bordered textarea-primary"
            placeholder="세번째 소원을 입력해주세요.(여러줄 가능)"
            rows="3"
          ></textarea>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary flex-1">
            소원등록
          </button>
          <button
            onClick={handleBtnCancelOnClick}
            type="button"
            className="btn btn-warning flex-1"
          >
            입력취소
          </button>
        </div>
      </form>
    </div>
  );
};

const HomeSplashPage = ({ history }) => {
  const [appRunCount, setAppRunCount] = useRecoilState(appRunCountAtom);
  const needToGoHomeHowToPage = appRunCount == 0;

  useEffect(() => {
    // 엘리먼트 첫 렌더링 시 실행
    const timeoutId = setTimeout(() => {
      const url = needToGoHomeHowToPage ? "/home/howTo" : "/home/main"; // 원본

      history.replace(url);
    }, 1500);

    // 엘리먼트가 제거되기 전에 자동으로 실행
    return () => {
      clearTimeout(timeoutId);
      setAppRunCount(appRunCount + 1);
    };
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center text-2xl font-bold">
      <div>
        <div>소원을 이루어 드립니다.</div>
      </div>
    </div>
  );
};

const HomeHowToPage = ({ history }) => {
  const handleBtnStartOnClick = () => {
    history.replace("/home/main");
  };

  const swiperSlideClassName =
    "swiper-slide flex justify-center items-center px-14";

  return (
    <div className="min-h-screen flex">
      <SwiperSlider
        swiperOptions={{
          pagination: {
            el: ".swiper-pagination",
            type: "progressbar",
          },
        }}
      >
        <div className="swiper-wrapper">
          <div className={swiperSlideClassName}>
            <div>사용법</div>
          </div>
          <div className={swiperSlideClassName}>
            <div>세가지 소원을 입력해주세요.</div>
          </div>
          <div className={swiperSlideClassName}>
            <div>한번 입력된 소원은 4주간 고칠 수 없습니다.</div>
          </div>
          <div className={swiperSlideClassName}>
            <div>소원은 간청이 아닌 완료형으로 입력해주세요.</div>
          </div>
          <div className={swiperSlideClassName}>
            <div>
              쇼미더머니 11에서 1등하길 기원합니다.(
              <span className="text-red-500">x</span>)
            </div>
          </div>
          <div className={swiperSlideClassName}>
            <div>
              제발 제가 쇼미더머니 11에서 1등하게 해주세요.(
              <span className="text-red-500">x</span>)
            </div>
          </div>
          <div className={swiperSlideClassName}>
            <div>
              내가 이번 쇼미더머니 11에서 당당히 1등을 차지해서 너무 행복하고
              감사합니다.(<span className="text-green-500">o</span>)
            </div>
          </div>
          <div className={swiperSlideClassName}>
            <div className="flex flex-col justify-center">
              <div>4주마다, 새로운 3가지 소원을 이뤄보세요.</div>
              <button
                onClick={handleBtnStartOnClick}
                className="btn btn-primary btn-outline mt-2"
              >
                시작하기
              </button>
            </div>
          </div>
        </div>
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-pagination"></div>
      </SwiperSlider>
    </div>
  );
};

const HomeMainPage = ({ history }) => {
  const { wishes, deleteWishes } = useWishesStatus();

  const handleBtnGoWishAddPageOnClick = () => {
    history.push("/wish/add");
  };

  const handleBtnGoHomeHowToPageOnClick = () => {
    history.push("/home/howTo");
  };

  const addWishesDiv = wishes.length == 0 && (
    <div className="mt-3 flex flex-col gap-4 items-center">
      <div>아직 소원이 등록되어 있지 않습니다.</div>
      <div>소원을 등록해주세요.</div>
      <div>
        <button
          onClick={handleBtnGoWishAddPageOnClick}
          className="btn btn-outline btn-primary"
        >
          소원등록하기
        </button>
      </div>
    </div>
  );

  const wishesDiv = wishes.length > 0 && (
    <div className="mt-3">
      <h1 className="text-2xl">등록된 소원 리스트</h1>
      <ul className="flex flex-col gap-3 mt-2">
        {wishes.map((wish) => (
          <li key={wish.id}>
            <div>
              번호 : <span className="badge badge-priamry">{wish.id}</span>
            </div>
            <div>
              날짜 : <span className="badge badge-accent">{wish.regDate}</span>
            </div>
            <div>
              내용
              <br />
              {wish.title}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const handleBtnDeleteWishesOnClick = () => {
    if (confirm("정말 소원들을 삭제하시겠습니까?")) {
      deleteWishes();
    }
  };

  const editWishesDiv = wishes.length > 0 && (
    <div className="mt-3 flex gap-2 justify-center">
      <button
        onClick={handleBtnDeleteWishesOnClick}
        className="btn btn-outline btn-error"
      >
        소원삭제
      </button>

      <button
        onClick={handleBtnGoWishAddPageOnClick}
        className="btn btn-outline btn-warning"
      >
        소원수정
      </button>
    </div>
  );

  return (
    <div className="px-3">
      {addWishesDiv}
      {wishesDiv}
      {editWishesDiv}
      <div className="mt-3 flex flex-col items-center">
        <button
          onClick={handleBtnGoHomeHowToPageOnClick}
          className="btn btn-outline btn-accent"
        >
          사용법 보기
        </button>
      </div>
    </div>
  );
};

// 라이브러리
// 스와이퍼

const SwiperSlider = React.memo(
  ({ className, style, swiperOptions, children }) => {
    className ??= "";
    swiperOptions ??= {};
    style ??= {};

    console.log("SwiperSlider, 실행!");

    const swiperElementRef = useRef();

    useEffect(() => {
      const baseSwiperOptions = {
        // If we need pagination
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },

        // Navigation arrows
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      };

      const finalSwiperOptions = Object.assign(
        baseSwiperOptions,
        swiperOptions
      );

      const swiper = new Swiper(swiperElementRef.current, finalSwiperOptions);

      return () => {
        console.log("스와이어 객체 제거됨!");
        swiper.destory();
      };
    }, []);

    return (
      <div
        className={"swiper " + className}
        ref={swiperElementRef}
        style={style}
      >
        {children}
      </div>
    );
  }
);

// 유틸
const getNowDateStr = () => {
  const today = new Date();
  today.setHours(today.getHours() + 9);
  return today.toISOString().replace("T", " ").substring(0, 19);
};

export default App;
