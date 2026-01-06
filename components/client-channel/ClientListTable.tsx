'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ClientMaster } from '@/lib/api/clientMaster'
import { updateClient } from '@/lib/api/clientMaster'

interface ClientListTableProps {
  clients: ClientMaster[]
  onUpdate: () => void
}

interface EditModalProps {
  client: ClientMaster
  field: string
  onClose: () => void
  onSave: (data: Partial<ClientMaster>) => Promise<void>
}

function EditModal({ client, field, onClose, onSave }: EditModalProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>(() => {
    switch (field) {
      case 'email':
        return {
          email: client.email || '',
          additional_emails: client.additional_emails || []
        }
      case 'phone':
        return {
          phone: client.phone || '',
          additional_phones: client.additional_phones || [],
          fax: client.fax || ''
        }
      case 'manager':
        return {
          manager_name: client.manager_name || '',
          additional_managers: client.additional_managers || []
        }
      case 'contract':
        return {
          contract_details: client.contract_details || {}
        }
      case 'contract_period':
        return {
          contract_start_date: client.contract_start_date || '',
          contract_end_date: client.contract_end_date || '',
          contract_type: client.contract_type || '',
          contract_history: client.contract_history || []
        }
      case 'notes':
        return {
          notes: client.notes || ''
        }
      default:
        return {}
    }
  })

  const handleSave = async () => {
    try {
      setSaving(true)
      await onSave(formData)
      onClose()
    } catch (error) {
      alert('저장에 실패했습니다: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const getTitle = () => {
    switch (field) {
      case 'email': return '이메일 관리'
      case 'phone': return '전화번호 관리'
      case 'manager': return '담당자 관리'
      case 'contract': return '계약 내용'
      case 'contract_period': return '계약 기간'
      case 'notes': return '메모'
      default: return '편집'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto z-[10000]" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
          <p className="text-sm text-gray-500 mt-1">{client.company_name}</p>
        </div>

        <div className="p-6 space-y-4">
          {field === 'email' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="이메일 주소"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">추가 이메일</label>
                <div className="space-y-2">
                  {(formData.additional_emails || []).map((email: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          const newEmails = [...formData.additional_emails]
                          newEmails[idx] = e.target.value
                          setFormData({ ...formData, additional_emails: newEmails })
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newEmails = formData.additional_emails.filter((_: string, i: number) => i !== idx)
                          setFormData({ ...formData, additional_emails: newEmails })
                        }}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, additional_emails: [...(formData.additional_emails || []), ''] })}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    + 이메일 추가
                  </button>
                </div>
              </div>
            </>
          )}

          {field === 'phone' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="전화번호"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">팩스번호</label>
                <input
                  type="tel"
                  value={formData.fax}
                  onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="팩스번호"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">추가 전화번호</label>
                <div className="space-y-2">
                  {(formData.additional_phones || []).map((phone: any, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={phone.type || ''}
                        onChange={(e) => {
                          const newPhones = [...formData.additional_phones]
                          newPhones[idx] = { ...newPhones[idx], type: e.target.value }
                          setFormData({ ...formData, additional_phones: newPhones })
                        }}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="유형"
                      />
                      <input
                        type="tel"
                        value={phone.number || ''}
                        onChange={(e) => {
                          const newPhones = [...formData.additional_phones]
                          newPhones[idx] = { ...newPhones[idx], number: e.target.value }
                          setFormData({ ...formData, additional_phones: newPhones })
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="전화번호"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPhones = formData.additional_phones.filter((_: any, i: number) => i !== idx)
                          setFormData({ ...formData, additional_phones: newPhones })
                        }}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, additional_phones: [...(formData.additional_phones || []), { type: '', number: '' }] })}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    + 전화번호 추가
                  </button>
                </div>
              </div>
            </>
          )}

          {field === 'manager' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">담당자명</label>
                <input
                  type="text"
                  value={formData.manager_name}
                  onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="담당자 이름"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">추가 담당자</label>
                <div className="space-y-2">
                  {(formData.additional_managers || []).map((manager: any, idx: number) => (
                    <div key={idx} className="p-3 border border-gray-200 rounded-lg space-y-2">
                      <input
                        type="text"
                        value={manager.name || ''}
                        onChange={(e) => {
                          const newManagers = [...formData.additional_managers]
                          newManagers[idx] = { ...newManagers[idx], name: e.target.value }
                          setFormData({ ...formData, additional_managers: newManagers })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="이름"
                      />
                      <input
                        type="text"
                        value={manager.role || ''}
                        onChange={(e) => {
                          const newManagers = [...formData.additional_managers]
                          newManagers[idx] = { ...newManagers[idx], role: e.target.value }
                          setFormData({ ...formData, additional_managers: newManagers })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="직책"
                      />
                      <input
                        type="text"
                        value={manager.contact || ''}
                        onChange={(e) => {
                          const newManagers = [...formData.additional_managers]
                          newManagers[idx] = { ...newManagers[idx], contact: e.target.value }
                          setFormData({ ...formData, additional_managers: newManagers })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="연락처"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newManagers = formData.additional_managers.filter((_: any, i: number) => i !== idx)
                          setFormData({ ...formData, additional_managers: newManagers })
                        }}
                        className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, additional_managers: [...(formData.additional_managers || []), { name: '', role: '', contact: '' }] })}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    + 담당자 추가
                  </button>
                </div>
              </div>
            </>
          )}

          {field === 'contract' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">계약 내용</label>
              <textarea
                value={JSON.stringify(formData.contract_details || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setFormData({ ...formData, contract_details: parsed })
                  } catch {
                    // JSON 파싱 실패 시 무시
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                rows={10}
                placeholder='{"계약금액": "", "결제방식": "", ...}'
              />
              <p className="mt-1 text-xs text-gray-500">JSON 형식으로 입력하세요</p>
            </div>
          )}

          {field === 'contract_period' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">계약 시작일</label>
                  <input
                    type="date"
                    value={formData.contract_start_date}
                    onChange={(e) => setFormData({ ...formData, contract_start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">계약 종료일</label>
                  <input
                    type="date"
                    value={formData.contract_end_date}
                    onChange={(e) => setFormData({ ...formData, contract_end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">계약 유형</label>
                <input
                  type="text"
                  value={formData.contract_type}
                  onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="예: 월간, 연간, 프로젝트"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">과거 계약 이력</label>
                <div className="space-y-2">
                  {(formData.contract_history || []).map((contract: any, idx: number) => (
                    <div key={idx} className="p-3 border border-gray-200 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">
                        {contract.start_date} ~ {contract.end_date} ({contract.type})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {field === 'notes' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                rows={6}
                placeholder="메모를 입력하세요"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ClientListTable({ clients, onUpdate }: ClientListTableProps) {
  const [editingField, setEditingField] = useState<{ clientId: string; field: string } | null>(null)

  const handleFieldClick = (clientId: string, field: string) => {
    setEditingField({ clientId, field })
  }

  const handleSave = async (clientId: string, data: Partial<ClientMaster>) => {
    await updateClient(clientId, data)
    onUpdate()
  }

  const editingClient = editingField ? clients.find(c => c.id === editingField.clientId) : null

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">업체명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">담당자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">전화번호</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">채널관리</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">계약</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">계약기간</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">메모</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    등록된 회원사가 없습니다.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/sales/clients/${client.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {client.company_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleFieldClick(client.id, 'email')}
                        className="text-sm text-gray-700 hover:text-blue-600 hover:underline cursor-pointer text-left"
                      >
                        <div>
                          {client.email && (
                            <div className="font-medium">{client.email}</div>
                          )}
                          {client.additional_emails && client.additional_emails.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{client.additional_emails.length}개 추가
                            </div>
                          )}
                          {!client.email && !client.additional_emails?.length && (
                            <div className="text-gray-400">이메일 추가</div>
                          )}
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleFieldClick(client.id, 'manager')}
                        className="text-sm text-gray-700 hover:text-blue-600 hover:underline cursor-pointer text-left"
                      >
                        <div>
                          {client.manager_name && (
                            <div className="font-medium">{client.manager_name}</div>
                          )}
                          {client.additional_managers && client.additional_managers.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{client.additional_managers.length}명 추가
                            </div>
                          )}
                          {!client.manager_name && !client.additional_managers?.length && (
                            <div className="text-gray-400">담당자 추가</div>
                          )}
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleFieldClick(client.id, 'phone')}
                        className="text-sm text-gray-700 hover:text-blue-600 hover:underline cursor-pointer text-left"
                      >
                        <div>
                          {client.phone && (
                            <div className="font-medium">{client.phone}</div>
                          )}
                          {client.fax && (
                            <div className="text-xs text-gray-500">팩스: {client.fax}</div>
                          )}
                          {client.additional_phones && client.additional_phones.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{client.additional_phones.length}개 추가
                            </div>
                          )}
                          {!client.phone && !client.fax && !client.additional_phones?.length && (
                            <div className="text-gray-400">전화번호 추가</div>
                          )}
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/sales/clients/${client.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        채널관리
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleFieldClick(client.id, 'contract')}
                        className="text-sm text-gray-700 hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {client.contract_details ? '계약 보기' : '계약 추가'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleFieldClick(client.id, 'contract_period')}
                        className="text-sm text-gray-700 hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {client.contract_start_date && client.contract_end_date
                          ? `${client.contract_start_date} ~ ${client.contract_end_date}`
                          : '기간 설정'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleFieldClick(client.id, 'notes')}
                        className="text-sm text-gray-700 hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {client.notes ? '메모 보기' : '메모 추가'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingField && editingClient && (
        <EditModal
          client={editingClient}
          field={editingField.field}
          onClose={() => setEditingField(null)}
          onSave={(data) => handleSave(editingField.clientId, data)}
        />
      )}
    </>
  )
}
