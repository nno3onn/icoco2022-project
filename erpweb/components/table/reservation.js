/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
import React from 'react';
import Link from 'next/link';

import calcDate from 'utils/time/calcDate';

import styles from './reservation.module.scss';

const ReservationTable = ({ data, types }) => {
  if (types === '전체') {
    return (
      <div>
        <div className={styles.heading}>
          <div className={styles.f15}>예약번호</div>
          <div className={styles.f1}>예약경로</div>
          <div className={styles.f1}>산모명</div>
          <div className={styles.f15}>도우미명</div>
          <div className={styles.f2}>산모 전화번호</div>
          <div className={styles.f2}>예약일</div>
          <div className={styles.f2}>상태</div>
        </div>
        <div className={styles['content-wrapper']}>
          {data.map((reservation) => (
            <Link
              href={`/reservation/${reservation.reservationNumber}`}
              key={reservation.reservationNumber}
            >
              <div className={styles.content}>
                <div className={styles.f15}>{reservation.reservationNumber}</div>
                <div className={styles.f1}>
                  {reservation.reservationRoute}
                  {reservation.duplication && reservation.duplication.ck ? (
                    <div className={styles.warning}>중복</div>
                  ) : null}
                </div>
                <div className={styles.f1}>{reservation.userName || '-'}</div>
                <div className={styles.f15}>
                  {reservation.changeManagerList && reservation.changeManagerList.length ? (
                    <div className={styles['manager-request']}>변경요청</div>
                  ) : !reservation.managersName &&
                    calcDate(reservation.serviceStartDate) <= 3 &&
                    calcDate(reservation.serviceStartDate) >= 0 ? (
                    <>
                      배정기한
                      <br />
                      <div className={styles['cost-status-ok']}>
                        {calcDate(reservation.serviceStartDate)}일 전
                      </div>
                    </>
                  ) : (
                    reservation.managersName || '-'
                  )}
                </div>
                <div className={styles.f2}>{reservation.phone || '-'}</div>
                <div className={styles.f2}>{reservation.date || '-'}</div>
                <div className={styles.f2}>
                  <div className={styles.status}>
                    {reservation.status && reservation.status.includes('예약') ? (
                      <>
                        예약
                        <span>
                          (출산일 {reservation.status === '예약출산일미확정' ? '미' : ''}확정)
                        </span>
                      </>
                    ) : (
                      reservation.status
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (types === '예약출산일미확정') {
    return (
      <div>
        <div className={styles.heading}>
          <div className={styles.f15}>예약번호</div>
          <div className={styles.f1}>예약경로</div>
          <div className={styles.f1}>산모명</div>
          <div className={styles.f15}>산모 전화번호</div>
          <div className={styles.f15}>예약일</div>
          <div className={styles.f1}>예약금</div>
          <div className={styles.f1}>잔금</div>
        </div>
        <div className={styles['content-wrapper']}>
          {data.map((reservation) => (
            <Link
              href={`/reservation/${reservation.reservationNumber}`}
              key={reservation.reservationNumber}
            >
              <div className={styles.content}>
                <div className={styles.f15}>{reservation.reservationNumber}</div>
                <div className={styles.f1}>
                  {reservation.reservationRoute}
                  {reservation.duplication && reservation.duplication.ck ? (
                    <div className={styles.warning}>중복</div>
                  ) : null}
                </div>
                <div className={styles.f1}>{reservation.userName || '-'}</div>
                <div className={styles.f15}>{reservation.phone || '-'}</div>
                <div className={styles.f15}>{reservation.date || '-'}</div>
                <div className={styles.f1}>
                  <div
                    className={
                      styles[
                        `cost-status-${
                          (reservation.isFinishedDeposit === '입금 전' && 'before') || 'ok'
                        }`
                      ]
                    }
                  >
                    {reservation.isFinishedDeposit}
                  </div>
                  {reservation.isFinishedDeposit === '입금완료' ? (
                    <div className={styles['cost-status-ok']}>
                      {reservation.depositCost.toLocaleString()}원
                    </div>
                  ) : reservation.notifyDepositCost ? (
                    <div className={styles.warning}>입금 확인 요청</div>
                  ) : null}
                </div>
                <div className={styles.f1}>
                  <div
                    className={
                      styles[
                        `cost-status-${
                          (reservation.isFinishedBalance === '입금 전' && 'before') ||
                          (reservation.isFinishedBalance === '입금 중' && 'ing') ||
                          (reservation.isFinishedBalance === '입금완료' && 'ok')
                        }`
                      ]
                    }
                  >
                    {reservation.isFinishedBalance}
                  </div>
                  {reservation.isFinishedBalance !== '입금완료' && reservation.notifyBalanceCost ? (
                    <div className={styles.warning}>입금 확인 요청</div>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
  if (types === '예약출산일확정') {
    return (
      <div>
        <div className={styles.heading}>
          <div className={styles.f15}>예약번호</div>
          <div className={styles.f1}>예약경로</div>
          <div className={styles.f1}>산모명</div>
          <div className={styles.f15}>도우미명</div>
          <div className={styles.f12}>산모 전화번호</div>
          <div className={styles.f12}>파견 예정일</div>
          <div className={styles.f12}>예약금</div>
          <div className={styles.f12}>잔금</div>
        </div>
        <div className={styles['content-wrapper']}>
          {data.map((reservation) => (
            <Link
              href={`/reservation/${reservation.reservationNumber}`}
              key={reservation.reservationNumber}
            >
              <div className={styles.content}>
                <div className={styles.f15}>{reservation.reservationNumber}</div>
                <div className={styles.f1}>
                  {reservation.reservationRoute}
                  {reservation.duplication && reservation.duplication.ck ? (
                    <div className={styles.warning}>중복</div>
                  ) : null}
                </div>
                <div className={styles.f1}>{reservation.userName || '-'}</div>
                <div className={styles.f15}>
                  {reservation.changeManagerList && reservation.changeManagerList.length ? (
                    <div className={styles['manager-request']}>변경요청</div>
                  ) : !reservation.managersName &&
                    calcDate(reservation.serviceStartDate) <= 3 &&
                    calcDate(reservation.serviceStartDate) >= 0 ? (
                    <>
                      배정기한
                      <br />
                      <div className={styles['cost-status-ok']}>
                        {calcDate(reservation.serviceStartDate)}일 전
                      </div>
                    </>
                  ) : (
                    reservation.managersName || '-'
                  )}
                </div>
                <div className={styles.f12}>{reservation.phone || '-'}</div>
                <div className={styles.f12}>{reservation.serviceStartDate || '-'}</div>
                <div className={styles.f12}>
                  <div
                    className={
                      styles[
                        `cost-status-${
                          (reservation.isFinishedDeposit === '입금 전' && 'before') || 'ok'
                        }`
                      ]
                    }
                  >
                    {reservation.isFinishedDeposit}
                  </div>
                  {reservation.isFinishedDeposit === '입금완료' ? (
                    <div className={styles['cost-status-ok']}>
                      {reservation.depositCost.toLocaleString()}원
                    </div>
                  ) : reservation.notifyDepositCost ? (
                    <div className={styles.warning}>입금 확인 요청</div>
                  ) : null}
                </div>
                <div className={styles.f12}>
                  <div
                    className={
                      styles[
                        `cost-status-${
                          (reservation.isFinishedBalance === '입금 전' && 'before') ||
                          (reservation.isFinishedBalance === '입금 중' && 'ing') ||
                          (reservation.isFinishedBalance === '입금완료' && 'ok')
                        }`
                      ]
                    }
                  >
                    {reservation.isFinishedBalance}
                  </div>
                  {reservation.isFinishedBalance === '입금완료' ? (
                    <div className={styles['cost-status-ok']}>
                      {reservation.balanceCost.toLocaleString()}원
                    </div>
                  ) : null}
                  {reservation.notifyBalanceCost ? (
                    <div className={styles.warning}>입금 확인 요청</div>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
  if (types === '파견중') {
    return (
      <div>
        <div className={styles.heading}>
          <div className={styles.f15}>예약번호</div>
          <div className={styles.f1}>예약경로</div>
          <div className={styles.f1}>산모명</div>
          <div className={styles.f15}>도우미명</div>
          <div className={styles.f12}>산모 전화번호</div>
          <div className={styles.f12}>파견일</div>
          <div className={styles.f12}>기간</div>
          <div className={styles.f12}>잔금</div>
        </div>
        <div className={styles['content-wrapper']}>
          {data.map((reservation) => (
            <Link
              href={`/reservation/${reservation.reservationNumber}`}
              key={reservation.reservationNumber}
            >
              <div className={styles.content}>
                <div className={styles.f15}>{reservation.reservationNumber}</div>
                <div className={styles.f1}>
                  {reservation.reservationRoute}
                  {reservation.duplication && reservation.duplication.ck ? (
                    <div className={styles.warning}>중복</div>
                  ) : null}
                </div>
                <div className={styles.f1}>{reservation.userName}</div>
                <div className={styles.f15}>{reservation.managersName || '-'}</div>
                <div className={styles.f12}>{reservation.phone}</div>
                <div className={styles.f12}>{reservation.serviceStartDate}</div>
                <div className={styles.f12}>{reservation.serviceDuration}</div>
                <div className={styles.f12}>
                  <div
                    className={
                      styles[
                        `cost-status-${
                          (reservation.isFinishedBalance === '입금 전' && 'before') ||
                          (reservation.isFinishedBalance === '입금 중' && 'ing') ||
                          (reservation.isFinishedBalance === '입금완료' && 'ok')
                        }`
                      ]
                    }
                  >
                    {reservation.isFinishedBalance}
                  </div>
                  {reservation.isFinishedBalance === '입금완료' ? (
                    <div className={styles['cost-status-ok']}>
                      {reservation.balanceCost.toLocaleString()}원
                    </div>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
  if (types === '서비스취소') {
    return (
      <div>
        <div className={styles.heading}>
          <div className={styles.f15}>예약번호</div>
          <div className={styles.f1}>예약경로</div>
          <div className={styles.f1}>산모명</div>
          <div className={styles.f15}>도우미명</div>
          <div className={styles.f12}>산모 전화번호</div>
          <div className={styles.f12}>파견일</div>
          <div className={styles.f1}>기간</div>
          <div className={styles.f12}>잔금</div>
        </div>
        <div className={styles['content-wrapper']}>
          {data.map((reservation) => (
            <Link
              href={`/reservation/${reservation.reservationNumber}`}
              key={reservation.reservationNumber}
            >
              <div className={styles.content}>
                <div className={styles.f15}>{reservation.reservationNumber}</div>
                <div className={styles.f1}>
                  {reservation.reservationRoute}
                  {reservation.duplication && reservation.duplication.ck ? (
                    <div className={styles.warning}>중복</div>
                  ) : null}
                </div>
                <div className={styles.f1}>{reservation.userName}</div>
                <div className={styles.f15}>{reservation.managersName || '-'}</div>
                <div className={styles.f12}>{reservation.phone}</div>
                <div className={styles.f12}>{reservation.serviceStartDate}</div>
                <div className={styles.f1}>{reservation.serviceDuration}</div>
                <div className={styles.f12}>
                  <div
                    className={
                      styles[
                        `cost-status-${
                          (reservation.isFinishedBalance === '입금 전' && 'before') ||
                          (reservation.isFinishedBalance === '입금 중' && 'ing') ||
                          (reservation.isFinishedBalance === '입금완료' && 'ok')
                        }`
                      ]
                    }
                  >
                    {reservation.isFinishedBalance}
                  </div>
                  {reservation.isFinishedBalance === '입금완료' ? (
                    <div className={styles['cost-status-ok']}>
                      {reservation.balanceCost.toLocaleString()}원
                    </div>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
  if (types === '서비스종료') {
    return (
      <div>
        <div className={styles.heading}>
          <div className={styles.f15}>예약번호</div>
          <div className={styles.f1}>예약경로</div>
          <div className={styles.f1}>산모명</div>
          <div className={styles.f15}>도우미명</div>
          <div className={styles.f12}>산모 전화번호</div>
          <div className={styles.f12}>파견일</div>
          <div className={styles.f12}>잔금</div>
        </div>
        <div className={styles['content-wrapper']}>
          {data.map((reservation) => (
            <Link
              href={`/reservation/${reservation.reservationNumber}`}
              key={reservation.reservationNumber}
            >
              <div className={styles.content}>
                <div className={styles.f15}>{reservation.reservationNumber}</div>
                <div className={styles.f1}>
                  {reservation.reservationRoute}
                  {reservation.duplication && reservation.duplication.ck ? <div>중복</div> : null}
                </div>
                <div className={styles.f1}>{reservation.userName}</div>
                <div className={styles.f15}>{reservation.managersName || '-'}</div>
                <div className={styles.f12}>{reservation.phone}</div>
                <div className={styles.f12}>{reservation.serviceStartDate}</div>
                <div className={styles.f12}>
                  <div
                    className={
                      styles[
                        `cost-status-${
                          (reservation.isFinishedBalance === '입금 전' && 'before') ||
                          (reservation.isFinishedBalance === '입금 중' && 'ing') ||
                          (reservation.isFinishedBalance === '입금완료' && 'ok')
                        }`
                      ]
                    }
                  >
                    {reservation.isFinishedBalance}
                  </div>
                  {reservation.isFinishedBalance === '입금완료' ? (
                    <div className={styles['cost-status-ok']}>
                      {reservation.balanceCost.toLocaleString()}원
                    </div>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default ReservationTable;
