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
    if (window.confirm('?????? ?????????????????????????')) {
      const onSuccess = () => {
        alert('?????? ?????????????????????.');
        router.push('/reservation/list');
      };

      const onError = () => {
        alert('?????? ??????????????????.');
      };

      deleteItem({ collectionName: 'Reservation', docId: reservationNumber }, onSuccess, onError);
    }
  };

  const handleUpdate = () => {
    router.push(`/reservation/${reservationNumber}/update`);
  };

  const handleConfirmReservationPayment = async () => {
    if (window.confirm('????????? ?????? ?????? ?????????????????????????')) {
      setIsFinishedDeposit('????????????');

      const updated = {
        reservationNumber,
        isFinishedDeposit: '????????????',
        openPopup: true,
        notifyDepositCost: false,
      };

      if (data.reservationRoute === '??????') {
        updated.userStep = 4;
      }

      const res = await updateReservation(updated);
      if (res) {
        alert('?????? ?????????????????????');
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm('????????? ??????????????? ?????????????????????????')) {
      console.log(1);
      const updated = { reservationNumber, changeManager: false };
      const res = await updateReservation(updated);

      if (res) {
        alert('?????? ?????????????????????.');
        return router.reload();
      }
    }
  };

  const handleConfirmBalancePayment = async () => {
    if (isFinishedDeposit === '?????? ???') {
      return alert('???????????? ?????? ????????? ??? ??????????????????.');
    }

    const cost = window.prompt('????????? ?????? ????????? ??????????????????.');
    const inputCost = Number(cost);

    if (Number.isNaN(inputCost)) {
      alert('????????? ??????????????????');
    } else if (window.confirm(`??????: ${inputCost}???\n????????? ?????????????????????????`)) {
      if (inputCost > data.balanceCost) {
        return alert('???????????? ????????? ???????????? ????????????. ?????? ??????????????????.');
      }

      const updated = {
        reservationNumber,
        completedBalanceCost: inputCost,
        notifyBalanceCost: false,
      };

      if (inputCost === 0) {
        setIsFinishedBalance('?????? ???');
        updated.isFinishedBalance = '?????? ???';
      } else if (inputCost === data.balanceCost) {
        setIsFinishedBalance('????????????');
        updated.isFinishedBalance = '????????????';
        updated.openPopup = true;
        if (data.reservationRoute === '??????') {
          updated.userStep = 5;
        }
      } else {
        setIsFinishedBalance('?????? ???');
        updated.isFinishedBalance = '?????? ???';
      }

      const res = await updateReservation(updated);
      if (res) {
        setCompletedBalanceCost(inputCost);
        alert('?????? ?????????????????????.');
      }
    }
  };

  const handleConfirmRefund = async () => {
    if (window.confirm('?????? ????????? ?????????????????????????')) {
      const refundPercent =
        (data.serviceRemainingDays / Number(data.serviceDuration.substring(0, 1)) / 5) * 100;

      const updated = {
        reservationNumber,
        status: '???????????????',
        refundAccepted: true,
        refundCost: (data.userCost * refundPercent) / 100,
        managersId: data.managersId,
        userStep: 8,
      };

      const res = await updateReservation(updated);
      if (res) {
        setStatus('???????????????');
        setRefundAccepted(true);
        alert('?????? ????????? ?????????????????????.');
      }
    }
  };

  useEffect(() => {
    if (!data) return;

    setReservationInfo([
      ...reservationInfo.map((info) =>
        info.k === '????????????' ? { k: '????????????', v: '???????????????' } : info,
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
        k: '????????? ????????????',
        v: data.serviceDuration,
      },
      {
        k: '?????????',
        v: miliToDate(data.date) || '-',
      },
      {
        k: '????????? ??????',
        v:
          data.serviceStartDate && data.serviceEndDate
            ? `${data.serviceStartDate} ~ ${data.serviceEndDate}`
            : '-',
      },
    ]);

    setUserInfo([
      {
        k: '?????????',
        v: data.userName || '-',
      },
      {
        k: '?????????',
        v: data.phone || '-',
      },
      {
        k: '??????????????????',
        v: data.fullRegNum || '-',
      },
      {
        k: '????????????',
        v: data.address || '-',
      },
      {
        k: '?????? ??????',
        v: data.placeToBeServiced || '-',
      },
    ]);

    setOtherInfo([
      { k: '????????????', v: data.isBirth ? 'O' : 'X' },
      { k: '????????????', v: data.birthType || '-' },
      { k: '?????? ?????? ??????', v: data.useHospital ? 'O' : 'X' },
      {
        k: '?????? ????????????',
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
      { k: '????????? ?????? ??????', v: data.useCareCenter ? 'O' : 'X' },
      {
        k: '????????? ????????????',
        v:
          data.careCenterStartDate && data.careCenterEndDate
            ? `${data.careCenterStartDate} ~ ${data.careCenterEndDate}`
            : data.careCenterDuration || '-',
      },
      { k: '????????????', v: data.lactationType || '-' },
      { k: '????????????', v: data.animalType || '-' },
    ]);

    setFamilyInfo([
      {
        k: '????????? ??????',
        v: data.allAdditionalFamily ? `${data.allAdditionalFamily.preschooler}???` : null,
      },
      {
        k: '?????????/????????????',
        v: data.allAdditionalFamily ? `${data.allAdditionalFamily.kindergartener}???` : null,
      },
      {
        k: '????????? ??????',
        v: data.allAdditionalFamily ? `${data.allAdditionalFamily.schooler}???` : null,
      },
      {
        k: '?????? ??????',
        v: data.allAdditionalFamily ? `${data.allAdditionalFamily.extraFamily}???` : null,
      },
    ]);

    setCostInfo([
      {
        k: '?????? ??????',
        v: data.voucher || '-',
      },
      {
        k: '?????? ??????',
        v: data.careType || '-',
      },
      {
        k: '??? ??????',
        v: data.totalCost ? `${data.totalCost.toLocaleString()}???` : '-',
      },
      {
        k: '????????????',
        v: data.extraCost ? `${data.extraCost.toLocaleString()}???` : '-',
      },
      {
        k: '?????? ?????????',
        v: data.revenueCost ? `${data.revenueCost.toLocaleString()}???` : '-',
      },
      {
        k: '?????? ???????????????',
        v: data.userCost ? `${data.userCost.toLocaleString()}???` : '-',
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
        k: '?????? ?????? ??????',
        v: data.refundRequested ? (
          refundAccepted ? (
            '?????? ?????? ??????'
          ) : (
            <>
              ?????? ??????
              <ProcessButton text="?????? ??????" type="refund" onClick={handleConfirmRefund} />
            </>
          )
        ) : null,
      },
      {
        k: '????????????',
        v: data.refundBank || '-',
      },
      {
        k: '????????????',
        v: data.refundAccountNumber || '-',
      },
      {
        k: '????????????',
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
        k: `?????? ${serviceDurationDays}??? (${data.serviceDuration})`,
        v: `${data.userCost.toLocaleString()}???`,
      },
      {
        k: `?????? ${serviceUsedDays}??? (${Math.round(100 - refundPercent)}%)`,
        v: `${(data.userCost - remainingCost).toLocaleString()}???`,
      },
      {
        k: `?????? ${Number(serviceRemainingDays)}??? (${Math.round(refundPercent)}%)`,
        v: `${remainingCost.toLocaleString()}???`,
      },
    ]);
  }, [refundAccepted]);

  useEffect(() => {
    if (!data) return;

    setReservationInfo([
      { k: '????????????', v: `${data.reservationRoute}` },
      {
        k: '????????????',
        v: status ? (
          status === '???????????????' ? (
            <div className={styles.warning}>{status}</div>
          ) : status.includes('??????') ? (
            <div>
              ??????
              <span style={{ color: '#503AA9' }}>
                {status === '?????????????????????' ? '(????????? ??????)' : '(????????? ?????????)'}
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
        k: '????????? ????????????',
        v:
          data.depositCost && Number(data.depositCost) !== 0 ? (
            <>
              {isFinishedDeposit === '????????????' && (
                <div className={styles.success}>
                  {isFinishedDeposit}
                  <span>{Number(data.depositCost).toLocaleString()}???</span>
                </div>
              )}
              {isFinishedDeposit === '?????? ???' && (
                <>
                  <div className={styles.wait}>
                    {isFinishedDeposit}
                    <div style={{ fontWeight: 'normal', marginLeft: 5, color: '#444' }}>
                      {data.notifyDepositCost ? '(?????? ?????? ??????)' : null}
                    </div>
                  </div>
                  <ProcessButton
                    text="?????? ????????????"
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
        k: '?????? ????????????',
        v:
          data.balanceCost && Number(data.balanceCost) !== 0 ? (
            <>
              {isFinishedBalance === '????????????' && (
                <div className={styles.success}>
                  {isFinishedBalance}
                  <span>{Number(data.balanceCost).toLocaleString()}???</span>
                </div>
              )}
              {(isFinishedBalance === '?????? ???' || isFinishedBalance === '?????? ???') && (
                <>
                  <div className={styles[isFinishedBalance === '?????? ???' ? 'ing' : 'wait']}>
                    {isFinishedBalance}
                    <span>
                      {`(${Number(completedBalanceCost).toLocaleString()}??? / ${Number(
                        data.balanceCost,
                      ).toLocaleString()}???)`}
                    </span>
                  </div>
                  <ProcessButton
                    text="?????? ??????"
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
        k: '????????????',
        v:
          data.changeManagerList && data.changeManagerList.length !== 0 ? (
            <>
              <div className={styles.warning}>????????? ????????????</div>
              <div>
                <ProcessButton text="????????????" type="refund" onClick={handleReject} />
                <ProcessButton
                  text="????????? ????????????"
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
                ????????? ?????? ??????
                {` ${timeBefore(data.serviceStartDate)}`}
              </div>
              <ProcessButton
                text="????????? ????????????"
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
                ????????????
                <span> {data.reservationNumber}</span>
              </div>
            </div>
            <div className={styles.divided} />
            {data.refundRequested ? (
              <>
                <div className={styles.label}>?????? ??????</div>
                <InfoTable data={refundInfo} />
                <div className={styles['receipt-wrapper']}>
                  <RefundReceipt data={refundReceiptData} />
                </div>
                <div className={styles.divided} />
              </>
            ) : null}
            <div className={styles.label}>?????? ??????</div>
            <InfoTable data={reservationInfo} />
            <div className={styles.divided} />
            <div className={styles.label}>?????? ??????</div>
            <InfoTable data={userInfo} />
            <div className={styles.divided} />
            <div className={styles.label}>?????? ??????</div>
            <InfoTable data={otherInfo} />
            <div className={styles.divided} />
            <div className={styles.label}>?????? ??? ?????? ?????? ??????</div>
            <InfoTable data={familyInfo} />
            <div className={styles.divided} />
            <div className={styles.label}>?????? ?? ?????? ?? ??????</div>
            <InfoTable data={costInfo} />
            <div className={styles.divided} />
            <div className={styles.label}>?????? ????????????</div>
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
            <div className={styles.label}>?????? ??????</div>
            <div className={styles['calendar-wrapper']}>
              {calendarData && <Calendar data={calendarData} />}
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>?????? ?????????</div>
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
                        {requested ? <div className={styles.requested}>?????? ??????</div> : null}
                      </div>
                    )
                  );
                })}
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>?????????</div>
            <InfoTable data={receiptInfo} />
            <div className={styles['receipt-wrapper']}>
              <Receipt data={receiptData} />
            </div>
            <div className={styles.divided} />
            <div className={styles['button-wrapper']}>
              {status === '???????????????' || status === '???????????????' ? null : (
                <ButtonComponent
                  isPrimary={false}
                  buttonWidth={300}
                  buttonHeight={46}
                  text="?????? ??????"
                  onClick={handleUpdate}
                />
              )}
              <ButtonComponent
                isPrimary={false}
                buttonWidth={300}
                buttonHeight={46}
                text="??????"
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
