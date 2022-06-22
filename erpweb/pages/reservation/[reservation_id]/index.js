/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable indent */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
/* eslint-disable operator-linebreak */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import ButtonComponent from 'components/button';
import Helmet from 'components/helmet';
import Receipt from 'components/receipt';
import Calendar from 'components/calendar';
import InfoTable from 'components/table/info';
import RefundReceipt from 'components/receipt/refund';
import ProcessButton from 'components/button/process';

import getManagerList from 'utils/manager/list';
import showItem from 'utils/common/show';
import deleteItem from 'utils/common/delete';
import calcDate from 'utils/time/calcDate';
import timeBefore from 'utils/time/timeBefore';
import updateReservation from 'utils/reservation/update';
import dateFormat from 'utils/format/getYYYYMMDD';
import miliToDate from 'utils/format/miliToDate';

import titleConfigs from 'configs/title';

import styles from './index.module.scss';

const ReservationPage = () => {
  const router = useRouter();
  const reservationNumber = router.query.reservation_id;

  const [data, setData] = useState();

  const [refundAccepted, setRefundAccepted] = useState();
  const [status, setStatus] = useState();
  const [isFinishedDeposit, setIsFinishedDeposit] = useState(null);
  const [isFinishedBalance, setIsFinishedBalance] = useState(null);
  const [completedBalanceCost, setCompletedBalanceCost] = useState(0);

  const [managerList, setManagerList] = useState([]);

  const [reservationInfo, setReservationInfo] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [otherInfo, setOtherInfo] = useState([]);
  const [familyInfo, setFamilyInfo] = useState([]);
  const [costInfo, setCostInfo] = useState([]);
  const [receiptInfo, setReceiptInfo] = useState([]);
  const [refundInfo, setRefundInfo] = useState([]);

  const [calendarData, setCalendarData] = useState();
  const [refundReceiptData, setRefundReceiptData] = useState([]);
  const [receiptData, setReceiptData] = useState({});

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const onSuccess = () => {
        alert('정상 반영되었습니다.');
        router.push('/reservation/list');
      };

      const onError = () => {
        alert('다시 시도해주세요.');
      };

      deleteItem({ collectionName: 'Reservation', docId: reservationNumber }, onSuccess, onError);
    }
  };

  const handleUpdate = () => {
    router.push(`/reservation/${reservationNumber}/update`);
  };

  const handleConfirmReservationPayment = async () => {
    if (window.confirm('예약금 입금 완료 처리하시겠습니까?')) {
      setIsFinishedDeposit('입금완료');

      const updated = {
        reservationNumber,
        isFinishedDeposit: '입금완료',
        openPopup: true,
        notifyDepositCost: false,
      };

      if (data.reservationRoute === '전화') {
        updated.userStep = 4;
      }

      const res = await updateReservation(updated);
      if (res) {
        alert('정상 반영되었습니다');
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm('관리사 변경요청을 반려하시겠습니까?')) {
      console.log(1);
      const updated = { reservationNumber, changeManager: false };
      const res = await updateReservation(updated);

      if (res) {
        alert('정상 반영되었습니다.');
        return router.reload();
      }
    }
  };

  const handleConfirmBalancePayment = async () => {
    if (isFinishedDeposit === '입금 전') {
      return alert('예약금을 입금 완료한 후 처리해주세요.');
    }

    const cost = window.prompt('입금된 잔금 금액을 입력해주세요.');
    const inputCost = Number(cost);

    if (Number.isNaN(inputCost)) {
      alert('숫자만 입력해주세요');
    } else if (window.confirm(`잔금: ${inputCost}원\n입금을 수정하시겠습니까?`)) {
      if (inputCost > data.balanceCost) {
        return alert('입력하신 금액이 잔금보다 많습니다. 다시 입력해주세요.');
      }

      const updated = {
        reservationNumber,
        completedBalanceCost: inputCost,
        notifyBalanceCost: false,
      };

      if (inputCost === 0) {
        setIsFinishedBalance('입금 전');
        updated.isFinishedBalance = '입금 전';
      } else if (inputCost === data.balanceCost) {
        setIsFinishedBalance('입금완료');
        updated.isFinishedBalance = '입금완료';
        updated.openPopup = true;
        if (data.reservationRoute === '전화') {
          updated.userStep = 5;
        }
      } else {
        setIsFinishedBalance('입금 중');
        updated.isFinishedBalance = '입금 중';
      }

      const res = await updateReservation(updated);
      if (res) {
        setCompletedBalanceCost(inputCost);
        alert('정상 반영되었습니다.');
      }
    }
  };

  const handleConfirmRefund = async () => {
    if (window.confirm('환불 요청을 승인하시겠습니까?')) {
      const refundPercent =
        (data.serviceRemainingDays / Number(data.serviceDuration.substring(0, 1)) / 5) * 100;

      const updated = {
        reservationNumber,
        status: '서비스종료',
        refundAccepted: true,
        refundCost: (data.userCost * refundPercent) / 100,
        managersId: data.managersId,
        userStep: 8,
      };

      const res = await updateReservation(updated);
      if (res) {
        setStatus('서비스종료');
        setRefundAccepted(true);
        alert('환불 요청을 승인하였습니다.');
      }
    }
  };

  useEffect(() => {
    if (!data) return;

    setReservationInfo([
      ...reservationInfo.map((info) =>
        info.k === '예약상태' ? { k: '예약상태', v: '서비스종료' } : info,
      ),
    ]);
  }, [status]);

  useEffect(() => {
    getManagerList(null, (list) => setManagerList(list));
  }, []);

  useEffect(() => {
    const onSuccess = (reservation) => {
      setData(reservation);

      setStatus(reservation.status);
      setRefundAccepted(reservation.refundAccepted || false);
      setCompletedBalanceCost(reservation.completedBalanceCost || 0);
      setIsFinishedBalance(reservation.isFinishedBalance);
      setIsFinishedDeposit(reservation.isFinishedDeposit);
    };

    showItem({ collectionName: 'Reservation', docId: reservationNumber }, onSuccess);
  }, []);

  useEffect(() => {
    if (!data) return;

    setReceiptInfo([
      {
        k: '서비스 이용주간',
        v: data.serviceDuration,
      },
      {
        k: '예약일',
        v: miliToDate(data.date) || '-',
      },
      {
        k: '서비스 기간',
        v:
          data.serviceStartDate && data.serviceEndDate
            ? `${data.serviceStartDate} ~ ${data.serviceEndDate}`
            : '-',
      },
    ]);

    setUserInfo([
      {
        k: '산모명',
        v: data.userName || '-',
      },
      {
        k: '연락처',
        v: data.phone || '-',
      },
      {
        k: '주민등록번호',
        v: data.fullRegNum || '-',
      },
      {
        k: '파견주소',
        v: data.address || '-',
      },
      {
        k: '조리 장소',
        v: data.placeToBeServiced || '-',
      },
    ]);

    setOtherInfo([
      { k: '출산여부', v: data.isBirth ? 'O' : 'X' },
      { k: '출산형태', v: data.birthType || '-' },
      { k: '병원 이용 여부', v: data.useHospital ? 'O' : 'X' },
      {
        k: '병원 이용기간',
        v:
          data.birthExpectedDate && data.hospitalEndDate
            ? `${dateFormat(
                new Date(
                  new Date(data.birthExpectedDate).setDate(
                    new Date(data.birthExpectedDate).getDate() + 1,
                  ),
                ),
              )} ~ ${data.hospitalEndDate}`
            : '-',
      },
      { k: '조리원 이용 여부', v: data.useCareCenter ? 'O' : 'X' },
      {
        k: '조리원 이용기간',
        v:
          data.careCenterStartDate && data.careCenterEndDate
            ? `${data.careCenterStartDate} ~ ${data.careCenterEndDate}`
            : data.careCenterDuration || '-',
      },
      { k: '수유형태', v: data.lactationType || '-' },
      { k: '애완동물', v: data.animalType || '-' },
    ]);

    setFamilyInfo([
      {
        k: '미취학 아동',
        v: data.allAdditionalFamily ? `${data.allAdditionalFamily.preschooler}명` : null,
      },
      {
        k: '유치원/어린이집',
        v: data.allAdditionalFamily ? `${data.allAdditionalFamily.kindergartener}명` : null,
      },
      {
        k: '초등생 이상',
        v: data.allAdditionalFamily ? `${data.allAdditionalFamily.schooler}명` : null,
      },
      {
        k: '기타 가족',
        v: data.allAdditionalFamily ? `${data.allAdditionalFamily.extraFamily}명` : null,
      },
    ]);

    setCostInfo([
      {
        k: '등급 유형',
        v: data.voucher || '-',
      },
      {
        k: '케어 형태',
        v: data.careType || '-',
      },
      {
        k: '총 금액',
        v: data.totalCost ? `${data.totalCost.toLocaleString()}원` : '-',
      },
      {
        k: '추가요금',
        v: data.extraCost ? `${data.extraCost.toLocaleString()}원` : '-',
      },
      {
        k: '정부 지원금',
        v: data.revenueCost ? `${data.revenueCost.toLocaleString()}원` : '-',
      },
      {
        k: '최종 본인부담금',
        v: data.userCost ? `${data.userCost.toLocaleString()}원` : '-',
      },
    ]);

    setCalendarData(
      data.isBirth
        ? {
            hospitalEndDate: data.hospitalEndDate || null,
            careCenterStartDate: data.careCenterStartDate || null,
            careCenterEndDate: data.careCenterEndDate || null,
            birthExpectedDate: data.birthExpectedDate || null,
            dispatchExpectedDate: data.serviceStartDate || null,
            serviceEndDate: data.serviceEndDate || null,
          }
        : {
            birthExpectedDate: data.birthExpectedDate || null,
          },
    );

    setReceiptData({
      totalCost: Number(data.totalCost),
      extraCost: Number(data.extraCost),
      revenueCost: Number(data.revenueCost),
      userCost: Number(data.userCost),
      depositCost: Number(data.depositCost),
      completedBalanceCost: Number(data.completedBalanceCost),
      balanceCost: Number(data.balanceCost),
      isFinishedDeposit: data.isFinishedDeposit,
      isFinishedBalance: data.isFinishedBalance,
      allAdditionalFamily: data.allAdditionalFamily,
    });
  }, [data]);

  useEffect(() => {
    if (!data || refundAccepted === null) return;

    setRefundInfo([
      {
        k: '환불 요청 여부',
        v: data.refundRequested ? (
          refundAccepted ? (
            '환불 승인 완료'
          ) : (
            <>
              환불 요청
              <ProcessButton text="환불 승인" type="refund" onClick={handleConfirmRefund} />
            </>
          )
        ) : null,
      },
      {
        k: '입금은행',
        v: data.refundBank || '-',
      },
      {
        k: '계좌번호',
        v: data.refundAccountNumber || '-',
      },
      {
        k: '예금주명',
        v: data.refundAccountHolder || '-',
      },
    ]);

    const serviceDurationDays = Number(data.serviceDuration.substring(0, 1)) * 7;
    const serviceRemainingDays = data.serviceRemainingDays || serviceDurationDays;
    const serviceUsedDays = serviceDurationDays - serviceRemainingDays;

    const refundPercent =
      (serviceRemainingDays / Number(data.serviceDuration.substring(0, 1)) / 7) * 100;
    const remainingCost = Math.ceil((data.userCost * refundPercent) / 1000) * 10;

    setRefundReceiptData([
      {
        k: `신청 ${serviceDurationDays}일 (${data.serviceDuration})`,
        v: `${data.userCost.toLocaleString()}원`,
      },
      {
        k: `이용 ${serviceUsedDays}일 (${Math.round(100 - refundPercent)}%)`,
        v: `${(data.userCost - remainingCost).toLocaleString()}원`,
      },
      {
        k: `잔여 ${Number(serviceRemainingDays)}일 (${Math.round(refundPercent)}%)`,
        v: `${remainingCost.toLocaleString()}원`,
      },
    ]);
  }, [refundAccepted]);

  useEffect(() => {
    if (!data) return;

    setReservationInfo([
      { k: '예약경로', v: `${data.reservationRoute}` },
      {
        k: '예약상태',
        v: status ? (
          status === '서비스취소' ? (
            <div className={styles.warning}>{status}</div>
          ) : status.includes('예약') ? (
            <div>
              예약
              <span style={{ color: '#503AA9' }}>
                {status === '예약출산일확정' ? '(출산일 확정)' : '(출산일 미확정)'}
              </span>
            </div>
          ) : (
            status
          )
        ) : (
          '-'
        ),
      },
      {
        k: '예약금 입금내역',
        v:
          data.depositCost && Number(data.depositCost) !== 0 ? (
            <>
              {isFinishedDeposit === '입금완료' && (
                <div className={styles.success}>
                  {isFinishedDeposit}
                  <span>{Number(data.depositCost).toLocaleString()}원</span>
                </div>
              )}
              {isFinishedDeposit === '입금 전' && (
                <>
                  <div className={styles.wait}>
                    {isFinishedDeposit}
                    <div style={{ fontWeight: 'normal', marginLeft: 5, color: '#444' }}>
                      {data.notifyDepositCost ? '(입금 확인 요청)' : null}
                    </div>
                  </div>
                  <ProcessButton
                    text="입금 완료처리"
                    type="cost"
                    onClick={handleConfirmReservationPayment}
                  />
                </>
              )}
            </>
          ) : (
            '-'
          ),
      },
      {
        k: '잔금 입금내역',
        v:
          data.balanceCost && Number(data.balanceCost) !== 0 ? (
            <>
              {isFinishedBalance === '입금완료' && (
                <div className={styles.success}>
                  {isFinishedBalance}
                  <span>{Number(data.balanceCost).toLocaleString()}원</span>
                </div>
              )}
              {(isFinishedBalance === '입금 중' || isFinishedBalance === '입금 전') && (
                <>
                  <div className={styles[isFinishedBalance === '입금 중' ? 'ing' : 'wait']}>
                    {isFinishedBalance}
                    <span>
                      {`(${Number(completedBalanceCost).toLocaleString()}원 / ${Number(
                        data.balanceCost,
                      ).toLocaleString()}원)`}
                    </span>
                  </div>
                  <ProcessButton
                    text="입금 처리"
                    type="cost"
                    onClick={handleConfirmBalancePayment}
                  />
                </>
              )}
            </>
          ) : (
            '-'
          ),
      },
      {
        k: '특이사항',
        v:
          data.changeManagerList && data.changeManagerList.length !== 0 ? (
            <>
              <div className={styles.warning}>관리사 변경요청</div>
              <div>
                <ProcessButton text="반려하기" type="refund" onClick={handleReject} />
                <ProcessButton
                  text="관리사 변경하기"
                  type="dispatch"
                  onClick={() => router.push(`/reservation/${reservationNumber}/update`)}
                />
              </div>
            </>
          ) : data.serviceStartDate &&
            calcDate(data.serviceStartDate) < 4 &&
            calcDate(data.serviceStartDate) > 0 ? (
            <>
              <div>
                관리사 배정 기한
                {` ${timeBefore(data.serviceStartDate)}`}
              </div>
              <ProcessButton
                text="관리사 배정하기"
                type="dispatch"
                onClick={() => router.push(`/reservation/${reservationNumber}/update`)}
              />
            </>
          ) : (
            '-'
          ),
      },
    ]);
  }, [completedBalanceCost, isFinishedBalance, isFinishedDeposit]);

  return (
    <>
      <Helmet title={titleConfigs.reservationShowTitle} />
      <div className={styles.container}>
        <Link href="/reservation/list">
          <a>
            <img className={styles.arrow} alt="arrow" src="/icons/arrow-left-g.png" />
          </a>
        </Link>
        {data ? (
          <>
            <div className={styles['heading-wrapper']}>
              <div className={styles.heading}>
                예약번호
                <span> {data.reservationNumber}</span>
              </div>
            </div>
            <div className={styles.divided} />
            {data.refundRequested ? (
              <>
                <div className={styles.label}>환불 정보</div>
                <InfoTable data={refundInfo} />
                <div className={styles['receipt-wrapper']}>
                  <RefundReceipt data={refundReceiptData} />
                </div>
                <div className={styles.divided} />
              </>
            ) : null}
            <div className={styles.label}>예약 정보</div>
            <InfoTable data={reservationInfo} />
            <div className={styles.divided} />
            <div className={styles.label}>기본 정보</div>
            <InfoTable data={userInfo} />
            <div className={styles.divided} />
            <div className={styles.label}>기타 정보</div>
            <InfoTable data={otherInfo} />
            <div className={styles.divided} />
            <div className={styles.label}>자녀 및 기타 가족 정보</div>
            <InfoTable data={familyInfo} />
            <div className={styles.divided} />
            <div className={styles.label}>등급 · 케어 · 요금</div>
            <InfoTable data={costInfo} />
            <div className={styles.divided} />
            <div className={styles.label}>산모 요청사항</div>
            <div className={styles.text}>
              {data.requirement
                ? data.requirement.split('\n').map((l) => (
                    <>
                      {l}
                      <br />
                    </>
                  ))
                : '-'}
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>예약 정보</div>
            <div className={styles['calendar-wrapper']}>
              {calendarData && <Calendar data={calendarData} />}
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>파견 관리사</div>
            <div className={styles['selected-section']}>
              {managerList &&
                data.managersId &&
                data.managersId.map((manager, index) => {
                  const managerInfo = managerList.find((m) => m.id === manager);
                  const requested = data.changeManagerList
                    ? data.changeManagerList.includes(manager)
                    : false;
                  return (
                    managerInfo && (
                      <div className={styles['selected-wrapper']} key={String(index)}>
                        <div
                          className={styles['selected-thumbnail']}
                          style={{
                            backgroundImage: `url(${
                              managerInfo.profileImage || '/icons/manager.png'
                            })`,
                          }}
                        />
                        <div className={styles['selected-name']}>{managerInfo.name}</div>
                        {requested ? <div className={styles.requested}>변경 필요</div> : null}
                      </div>
                    )
                  );
                })}
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>영수증</div>
            <InfoTable data={receiptInfo} />
            <div className={styles['receipt-wrapper']}>
              <Receipt data={receiptData} />
            </div>
            <div className={styles.divided} />
            <div className={styles['button-wrapper']}>
              {status === '서비스취소' || status === '서비스종료' ? null : (
                <ButtonComponent
                  isPrimary={false}
                  buttonWidth={300}
                  buttonHeight={46}
                  text="정보 수정"
                  onClick={handleUpdate}
                />
              )}
              <ButtonComponent
                isPrimary={false}
                buttonWidth={300}
                buttonHeight={46}
                text="삭제"
                onClick={handleDelete}
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ReservationPage;
