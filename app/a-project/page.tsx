/**
 * A프로젝트 홈페이지
 * 공기청정기 MVP
 */
export default function AProjectPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            A프로젝트
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI 기반 쇼핑 판단 플랫폼
          </p>
          <p className="text-gray-500">
            무엇을 살지 고민될 때, 정직한 판단을 도와드립니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 셀프 판단 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">셀프 판단</h2>
            <p className="text-gray-600 mb-4">
              제품을 직접 선택하고 AI가 판단해드립니다
            </p>
            <a
              href="/a-project/products/air-purifier"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              공기청정기 판단 시작
            </a>
          </div>

          {/* 의뢰 서비스 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">의뢰 서비스</h2>
            <p className="text-gray-600 mb-4">
              복잡한 조건의 제품 탐색을 대신 해드립니다
            </p>
            <a
              href="/a-project/concierge"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              의뢰하기
            </a>
          </div>
        </div>

        {/* 핵심 원칙 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">A프로젝트의 원칙</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              <span>&quot;이게 최고예요&quot; 식 단순 추천 금지</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>&quot;이런 조건에선 적합 / 이런 경우엔 비추천&quot; 조건부 판단</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>&quot;지금은 사지 마세요&quot;를 말할 수 있어야 함</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
