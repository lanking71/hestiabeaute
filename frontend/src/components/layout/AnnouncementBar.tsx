// =====================================================
// 📁 AnnouncementBar.tsx — 최상단 공지 띠
// =====================================================
// 화면 가장 위에 표시되는 얇은 공지 배너 컴포넌트예요.
// "5만원 이상 무료 샘플 증정" 같은 짧은 공지를 보여줘요.
//
// 단순한 정적 컴포넌트라 props(외부 데이터)가 없어요.
// 내용을 바꾸려면 이 파일의 텍스트를 직접 수정하면 돼요.
// =====================================================

export default function AnnouncementBar() {
  return (
    // bg-hestia-dark: 거의 검정색 배경 | text-white: 흰 글씨
    // text-xs: 아주 작은 글씨 (12px) | text-center: 가운데 정렬
    // py-2: 위아래 패딩 | px-4: 좌우 패딩
    <div className="bg-hestia-dark text-white text-xs text-center py-2 px-4">
      <p>글루타치온 기반 프리미엄 스킨케어 &nbsp;|&nbsp; 5만원 이상 구매 시 무료 샘플 증정</p>
      {/* &nbsp; = 줄바꿈 없는 공백 (HTML 특수 문자) */}
    </div>
  );
}
