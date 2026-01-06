/**
 * 공기청정기 판단 페이지
 * MVP: 공기청정기 카테고리 전용
 */
"use client";

import { useState } from "react";

export default function AirPurifierPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [conditions, setConditions] = useState({
    budget: "",
    roomSize: "",
    usage: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [judgeResult, setJudgeResult] = useState<any>(null);

  // TODO: 실제 제품 데이터는 API에서 가져오기
  const products = [
    { id: "1", name: "삼성 BESPOKE 큐브", brand: "삼성", price: "500000" },
    { id: "2", name: "LG 퓨리케어", brand: "LG", price: "400000" },
    { id: "3", name: "샤오미 공기청정기", brand: "샤오미", price: "200000" },
  ];

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleJudge = async () => {
    if (selectedProducts.length < 1) {
      alert("최소 1개 이상의 제품을 선택해주세요");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 실제 API 호출
      const response = await fetch("/api/a-project/v1/judge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_ids: selectedProducts,
          conditions: {
            budget: conditions.budget ? parseInt(conditions.budget) : null,
            room_size: conditions.roomSize ? parseInt(conditions.roomSize) : null,
            usage: conditions.usage || null,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "판단 요청 실패");
      }

      const result = await response.json();
      setJudgeResult(result);
    } catch (error: any) {
      alert(error.message || "판단 요청 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            공기청정기 판단
          </h1>
          <p className="text-gray-600">
            비교할 제품을 선택하고 조건을 입력하세요
          </p>
        </div>

        {/* 제품 선택 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">제품 선택</h2>
          <div className="space-y-3">
            {products.map((product) => (
              <label
                key={product.id}
                className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleProductToggle(product.id)}
                  className="mr-4 w-5 h-5"
                />
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {product.brand} · {product.price}원
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 조건 입력 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">조건 입력</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                예산 (원)
              </label>
              <input
                type="number"
                value={conditions.budget}
                onChange={(e) =>
                  setConditions({ ...conditions, budget: e.target.value })
                }
                placeholder="예: 500000"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                방 크기 (평)
              </label>
              <input
                type="number"
                value={conditions.roomSize}
                onChange={(e) =>
                  setConditions({ ...conditions, roomSize: e.target.value })
                }
                placeholder="예: 20"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                용도
              </label>
              <input
                type="text"
                value={conditions.usage}
                onChange={(e) =>
                  setConditions({ ...conditions, usage: e.target.value })
                }
                placeholder="예: 침실, 거실"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 판단 버튼 */}
        <div className="mb-6">
          <button
            onClick={handleJudge}
            disabled={isLoading || selectedProducts.length < 1}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "판단 중..." : "AI 판단 시작"}
          </button>
        </div>

        {/* 판단 결과 */}
        {judgeResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">판단 결과</h2>

            {/* 비추천 제품 먼저 */}
            {judgeResult.not_recommended && judgeResult.not_recommended.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-red-600 mb-3">
                  ⚠️ 먼저 확인하세요
                </h3>
                <div className="space-y-3">
                  {judgeResult.not_recommended.map((item: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-red-500 pl-4 py-2">
                      <div className="font-medium mb-1">비추천 제품</div>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {item.reasons.map((reason: string, rIdx: number) => (
                          <li key={rIdx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 추천 제품 */}
            {judgeResult.recommendations && judgeResult.recommendations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-green-600 mb-3">
                  ✓ 조건에 맞는 제품
                </h3>
                <div className="space-y-3">
                  {judgeResult.recommendations.map((item: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="font-medium mb-1">
                        추천 제품 (적합도: {item.score}점)
                      </div>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {item.reasons.map((reason: string, rIdx: number) => (
                          <li key={rIdx}>{reason}</li>
                        ))}
                      </ul>
                      {item.warnings && item.warnings.length > 0 && (
                        <div className="mt-2 text-sm text-yellow-600">
                          주의: {item.warnings.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 사도 되는 이유 / 사면 안 되는 이유 */}
            {judgeResult.reasons && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">
                    사도 되는 이유
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {judgeResult.reasons.buy?.map((reason: string, idx: number) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">
                    사면 안 되는 이유
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {judgeResult.reasons.dont_buy?.map((reason: string, idx: number) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 추가 질문이 필요한 경우 */}
            {judgeResult.needs_more_info && judgeResult.questions && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold mb-2">추가 정보가 필요합니다</h4>
                <ul className="list-disc list-inside text-sm">
                  {judgeResult.questions.map((q: string, idx: number) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
