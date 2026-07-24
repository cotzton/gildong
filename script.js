// --- DOM 요소 선택 ---
const darkModeBtn = document.getElementById('dark-mode-toggle');
const fontIncBtn = document.getElementById('font-increase');
const fontDecBtn = document.getElementById('font-decrease');

const navHome = document.getElementById('nav-home');
const navList = document.getElementById('nav-list');

const writeSection = document.getElementById('write-section');
const listSection = document.getElementById('list-section');
const viewSection = document.getElementById('view-section');

const titleInput = document.getElementById('diary-title');
const contentInput = document.getElementById('diary-content');
const saveBtn = document.getElementById('save-btn');

const diaryListEl = document.getElementById('diary-list');
const viewTitle = document.getElementById('view-title');
const viewContent = document.getElementById('view-content');
const backToListBtn = document.getElementById('back-to-list-btn');

// --- 상태 변수 ---
// 로컬 스토리지에서 일기 데이터를 불러오거나, 없으면 빈 배열 생성
let diaries = JSON.parse(localStorage.getItem('diaries')) || [];
let currentFontSize = 16;

// --- 1. 다크모드 기능 ---
darkModeBtn.addEventListener('click', () => {
    // <html> 태그에 data-theme 속성을 토글하여 CSS 적용
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'light');
        darkModeBtn.textContent = '🌙 다크모드';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeBtn.textContent = '☀️ 라이트모드';
    }
});

// --- 2. 폰트 크기 조절 기능 ---
fontIncBtn.addEventListener('click', () => {
    currentFontSize += 2;
    document.body.style.fontSize = currentFontSize + 'px';
});

fontDecBtn.addEventListener('click', () => {
    currentFontSize = Math.max(12, currentFontSize - 2); // 글자가 너무 작아지지 않게 최소 12px 설정
    document.body.style.fontSize = currentFontSize + 'px';
});

// --- 화면 전환 함수 ---
function showSection(sectionToShow) {
    writeSection.classList.add('hidden');
    listSection.classList.add('hidden');
    viewSection.classList.add('hidden');
    sectionToShow.classList.remove('hidden');
}

// 네비게이션 버튼 이벤트
navHome.addEventListener('click', () => showSection(writeSection));
navList.addEventListener('click', () => {
    renderList(); // 목록 화면을 열 때 최신 데이터로 다시 그림
    showSection(listSection);
});
backToListBtn.addEventListener('click', () => showSection(listSection));

// --- 3. 일기 저장 기능 (localStorage) ---
saveBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요!');
        return;
    }

    // 새로운 일기 객체 생성
    const newDiary = {
        id: Date.now(), // 고유 ID로 현재 시간 사용
        title: title,
        content: content,
        date: new Date().toLocaleDateString()
    };

    diaries.push(newDiary); // 배열에 추가
    localStorage.setItem('diaries', JSON.stringify(diaries)); // 로컬 스토리지에 저장 (문자열 변환)

    // 입력폼 초기화
    titleInput.value = '';
    contentInput.value = '';
    
    alert('일기가 성공적으로 저장되었습니다.');
});

// --- 4. 저장된 일기 목록 보여주기 ---
function renderList() {
    diaryListEl.innerHTML = ''; // 기존 목록 초기화
    
    if (diaries.length === 0) {
        diaryListEl.innerHTML = '<li>아직 작성된 일기가 없습니다.</li>';
        return;
    }

    // 최신 글이 위로 오도록 배열을 복사 후 뒤집어서 출력
    [...diaries].reverse().forEach(diary => {
        const li = document.createElement('li');
        li.textContent = `${diary.title} (${diary.date})`;
        
        // 목록 클릭 시 상세 보기로 이동
        li.addEventListener('click', () => showDiaryDetail(diary.id));
        diaryListEl.appendChild(li);
    });
}

// --- 5. 일기 상세 내용 보기 ---
function showDiaryDetail(id) {
    const diary = diaries.find(d => d.id === id); // ID로 일기 찾기
    if (diary) {
        viewTitle.textContent = diary.title;
        viewContent.textContent = diary.content;
        showSection(viewSection);
    }
}
