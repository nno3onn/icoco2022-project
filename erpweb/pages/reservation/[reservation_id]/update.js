/* eslint-disable object-curly-newline */
/* eslint-disable indent */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */

import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import ButtonComponent from 'components/button';
import Helmet from 'components/helmet';
import Input from 'components/input';
import Dropdown from 'components/dropdown';
import Radiobox from 'components/radiobox';
import ManagerModal from 'components/modal/manager';
import TextArea from 'components/textArea';
import MiniButton from 'components/button/mini';

import configs from 'configs/data';
import onlyNumber from 'utils/input/onlyNumber';
import verifyDate from 'utils/input/verifyDate';
import getManagerList from 'utils/manager/list';
import dateFormat from 'utils/format/getYYYYMMDD';

import { useRouter } from 'next/router';
import showItem from 'utils/common/show';
import updateReservation from 'utils/reservation/update';
import titleConfigs from 'configs/title';

import styles from 'pages/reservation/create/index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import { getAuth } from '@firebase/auth';

const ReservationUpdatePage = () => {
  const router = useRouter();
  const reservationNumber = router.query.reservation_id;

  const [data, setData] = useState();
  const [extraCostList, setExtraCostList] = useState();

  // 기본정보
  const [fullRegNumFront, setFullRegNumFront] = useState('');
  const [fullRegNumBack, setFullRegNumBack] = useState('');
  const [address, setAddress] = useState('');
  const [placeToBeServiced, setPlaceToBeServiced] = useState('자가');

  // 등급 케어 요금
  const [rankFront, setRankFront] = useState('');
  const [rankCenter, setRankCenter] = useState('');
  const [rankBack, setRankBack] = useState('');
  const [isVoucher, setIsVoucher] = useState('');
  const [careType, setCareType] = useState('출퇴근형');
  const [extraCost, setExtraCost] = useState();
  const [revenueCost, setRevenueCost] = useState();
  const [userCost, setUserCost] = useState();
  const [serviceCost, setServiceCost] = useState();

  // 기타 정보
  const [isBirth, setIsBirth] = useState('O');
  const [birthType, setBirthType] = useState('자연분만');
  const [lactationType, setLactationType] = useState('모유');
  const [animalType, setAnimalType] = useState('없음');
  const [useCareCenter, setUseCareCenter] = useState('X');
  const [careCenterStartDate, setCareCenterStartDate] = useState('');
  const [careCenterEndDate, setCareCenterEndDate] = useState('');
  const [careCenterDuration, setCareCenterDuration] = useState();
  const [useHospital, setUseHospital] = useState('O');
  const [hospitalEndDate, setHospitalEndDate] = useState('');

  // 자녀 및 기타가족 정보
  const [preschooler, setPreschooler] = useState('');
  const [kindergartener, setKindergartener] = useState('');
  const [schooler, setSchooler] = useState('');
  const [extraFamily, setExtraFamily] = useState('');

  // 산모 요청사항
  const [requirement, setRequirement] = useState('');

  // 예약 정보
  const [birthExpectedDate, setBirthExpectedDate] = useState('');
  const [serviceStartDate, setserviceStartDate] = useState('');
  const [serviceDuration, setServiceDuration] = useState();
  const [serviceEndDate, setServiceEndDate] = useState('');

  // 파견 관리사
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [beforeManagersId, setBeforeManagersId] = useState([]);
  const [managersId, setManagersId] = useState([]);
  const [managersName, setManagersName] = useState([]);
  const [managersData, setManagersData] = useState([]);
  const [managerList, setManagerList] = useState();

  // 회사 요금 정보
  const [serviceCostInfo, setServiceCostInfo] = useState();
  const [revenueCostInfo, setRevenueCostInfo] = useState();

  const handleResetRank = () => {
    setRankFront('');
    setRankCenter('');
    setRankBack('');
  };

  const handleSubmit = async () => {
    if (!rankFront || !rankCenter || ((rankFront === 'A' || rankFront === 'B') && !rankBack)) {
      return alert('등급 유형을 입력해주세요');
    }
    if (!isBirth) {
      return alert('출산일을 입력해주세요');
    }
    if (!serviceStartDate || !serviceEndDate) {
      return alert('서비스 이용 기간을 입력해주세요');
    }
    if (serviceCost === null || extraCost === null || revenueCost === null || userCost === null) {
      return alert('모든 요금을 작성해주세요');
    }
    if (!isVoucher) {
      return alert('바우처 여부를 입력해주세요');
    }
    if (useHospital === 'O' && !hospitalEndDate) {
      return alert('병원 퇴원일을 작성해주세요');
    }
    if (isBirth === 'X' && useCareCenter === 'O' && careCenterDuration) {
      return alert('조리원 이용 기간을 입력해주세요');
    }
    if (isBirth === 'O' && useCareCenter === 'O' && (!careCenterStartDate || !careCenterEndDate)) {
      return alert('조리원 입원일과 퇴원일을 작성해주세요');
    }
    if (fullRegNumFront && (fullRegNumFront.length !== 6 || fullRegNumBack.length !== 7)) {
      return alert('주민등록번호를 올바르게 입력해주세요.');
    }
    if (serviceStartDate && !verifyDate(serviceStartDate)) {
      return alert('파견 예정일은 20xx.xx.xx으로 작성해주세요');
    }
    if (birthExpectedDate && !verifyDate(birthExpectedDate)) {
      return alert('출산 예정일은 20xx.xx.xx으로 작성해주세요');
    }
    if (careCenterStartDate && !verifyDate(careCenterStartDate)) {
      return alert('조리원 입원일은 20xx.xx.xx으로 작성해주세요');
    }
    if (careCenterEndDate && !verifyDate(careCenterEndDate)) {
      return alert('조리원 퇴원일은 20xx.xx.xx으로 작성해주세요');
    }
    if (hospitalEndDate && !verifyDate(hospitalEndDate)) {
      return alert('병원 퇴원일은 20xx.xx.xx으로 작성해주세요');
    }

    if (window.confirm('예약을 수정하시겠습니까?')) {
      const reservationInfo = {
        status: data.status.includes('예약')
          ? isBirth
            ? '예약출산일확정'
            : '예약출산일미확정'
          : null,
        reservationNumber,
        fullRegNum:
          fullRegNumFront && fullRegNumBack ? `${fullRegNumFront}-${fullRegNumBack}` : null,
        address,
        phone: data.phone,
        placeToBeServiced,
        voucher: `${rankFront}-${rankCenter}${
          rankFront === 'A' || rankFront === 'B' ? `-${rankBack}` : ''
        }`,
        careType,
        isBirth,
        birthType,
        lactationType,
        animalType,
        requirement,
        birthExpectedDate,
        serviceStartDate,
        serviceEndDate,
        managersId,
        managersName,
        serviceDuration,
        extraCost: Number(extraCost),
        revenueCost: Number(revenueCost),
        userCost: Number(userCost),
        allAdditionalFamily: {
          preschooler: Number(preschooler) || 0,
          kindergartener: Number(kindergartener) || 0,
          schooler: Number(schooler) || 0,
          extraFamily: Number(extraFamily) || 0,
        },
        reservationRoute: data.reservationRoute,
        useCareCenter,
        careCenterStartDate,
        careCenterEndDate,
        careCenterDuration,
        useHospital,
        hospitalEndDate,
        beforeManagersId,
        email: data.email,
        completedBalanceCost: data.completedBalanceCost,
        isFirstDispatchManager: data.isFirstDispatchManager,
        changeManagerList: data.changeManagerList || [],
        userName: data.userName,
      };

      const res = await updateReservation(reservationInfo);
      if (res) {
        alert('정상 반영되었습니다.');
        router.push(`/reservation/${reservationNumber}`);
      }
    }
  };

  const handleExpectedDate = () => {
    if (!serviceStartDate || !serviceDuration || !verifyDate(serviceStartDate)) {
      return setServiceEndDate('');
    }

    const year = serviceStartDate.split('.')[0];
    const month = serviceStartDate.split('.')[1];
    const day = serviceStartDate.split('.')[2];
    const additional = serviceDuration.substring(0, 1) * 7 - 1;
    const endDate = new Date(year, month - 1, Number(day) + additional);

    setServiceEndDate(dateFormat(endDate));
  };

  useEffect(() => {
    const onSuccess = (list) => {
      setManagerList(list);
    };

    getManagerList(null, onSuccess);

    const { uid } = getAuth().currentUser;

    const onSuccess2 = (res) => {
      const { preschoolerCost, kindergartenerCost, schoolerCost, extraFamilyCost } = res;
      setExtraCostList({
        preschoolerCost: preschoolerCost || 0,
        kindergartenerCost: kindergartenerCost || 0,
        schoolerCost: schoolerCost || 0,
        extraFamilyCost: extraFamilyCost || 0,
      });

      if (res.serviceCostInfo) {
        setServiceCostInfo(res.serviceCostInfo);
      }
      if (res.revenueCostInfo) {
        setRevenueCostInfo(res.revenueCostInfo);
      }
    };

    showItem({ collectionName: 'Company', docId: uid }, onSuccess2);
  }, []);

  useEffect(() => {
    const onSuccess = (reservation) => {
      setData(reservation);

      const { fullRegNum } = reservation;
      setFullRegNumFront(fullRegNum ? fullRegNum.split('-')[0] : '');
      setFullRegNumBack(fullRegNum ? fullRegNum.split('-')[1] : '');
      setAddress(reservation.address);
      setPlaceToBeServiced(reservation.placeToBeServiced);

      // 등급 케어 정보
      const rank = reservation.voucher.split('-');
      setRankFront(rank[0] || '');
      setRankCenter(rank[1] || '');
      setRankBack(rank[2] || '');

      if (rank[0] === '일반') {
        setIsVoucher('X');
      } else {
        setIsVoucher('O');
      }

      setCareType(reservation.careType);
      setExtraCost(reservation.extraCost);
      setRevenueCost(reservation.revenueCost);
      setUserCost(reservation.userCost);
      setServiceCost(reservation.userCost + reservation.revenueCost - reservation.extraCost);

      // 기타정보
      setIsBirth(reservation.isBirth ? 'O' : 'X');
      setBirthType(reservation.birthType);
      setLactationType(reservation.lactationType);
      setAnimalType(reservation.animalType);
      setUseCareCenter(reservation.useCareCenter ? 'O' : 'X');
      setCareCenterStartDate(reservation.careCenterStartDate);
      setCareCenterEndDate(reservation.careCenterEndDate);
      setUseHospital(reservation.useHospital ? 'O' : 'X');
      setHospitalEndDate(reservation.hospitalEndDate);

      // 자녀 및 기타 가족 정보
      const AAF = reservation.allAdditionalFamily;
      setPreschooler(AAF.preschooler);
      setKindergartener(AAF.kindergartener);
      setSchooler(AAF.schooler);
      setExtraFamily(AAF.extraFamily);

      // 산모 요청사항
      setRequirement(reservation.requirement);

      // 예약 정보
      setBirthExpectedDate(reservation.birthExpectedDate);
      setserviceStartDate(reservation.serviceStartDate);
      setServiceEndDate(reservation.serviceEndDate);
      setServiceDuration(reservation.serviceDuration);

      // 파견관리사
      setManagersId(reservation.managersId);
      setManagersName(reservation.managersName);
      setBeforeManagersId(reservation.managersId);
    };
    showItem({ collectionName: 'Reservation', docId: reservationNumber }, onSuccess);
  }, []);

  useEffect(() => {
    if (data && data.managersId) {
      const getManagerInfo = (manager) => {
        const { profileImage, name } = manager;
        const managers = managersData.concat({
          profileImage,
          name,
        });
        setManagersData(managers);
      };

      data.managersId.forEach((managerId) => {
        showItem({ collectionName: 'Manager', docId: managerId }, getManagerInfo);
      });
    }
  }, managersId);

  useEffect(() => {
    if (isBirth === 'X') {
      setBirthType('자연분만');
      setUseHospital('X');

      setHospitalEndDate(null);
      setCareCenterEndDate(null);
    } else if (isBirth === 'O') {
      setUseHospital('O');
      setCareCenterDuration(null);
    }
  }, isBirth);

  useEffect(() => {
    handleExpectedDate();
  }, [serviceStartDate, serviceDuration]);

  const setCosts = () => {
    if (!serviceCostInfo || !revenueCostInfo) return;

    if (serviceDuration) {
      const r = `${rankFront}-${rankCenter}${
        rankFront === 'A' || rankFront === 'B' ? `-${rankBack}` : ''
      }`;
      const d = +serviceDuration.replace('주', '') - 1;

      let sc;
      let rc;

      if (serviceCostInfo[r] && serviceCostInfo[r][d]) {
        sc = serviceCostInfo[r][d] * (d === 4 ? 5 : 1);
        setServiceCost(sc);
      }
      if (rankFront === '일반') {
        setRevenueCost(0);
        setUserCost(sc);
      } else {
        if (revenueCostInfo[r] && revenueCostInfo[r][d]) {
          rc = revenueCostInfo[r][d];
          setRevenueCost(rc);
        }
        if (sc && rc) {
          const uc = sc - rc;
          setUserCost(uc);
        }
      }
    }
  };

  useEffect(() => {
    if (rankFront === 'C' || rankFront === '일반') {
      setCosts();
    }
  }, [rankCenter]);

  useEffect(() => {
    setCosts();
  }, [rankBack, serviceDuration]);

  const handleClickRankFront = () => {
    setRankCenter('');
    setRankBack('');
    setRevenueCost('');
    setUserCost('');
    setServiceCost('');
  };

  return (
    <>
      {isOpenModal && (
        <ManagerModal
          opener={setIsOpenModal}
          list={managerList}
          data={managersId}
          reservationNumber={reservationNumber}
          names={managersName}
          setter={setManagersId}
          setterName={setManagersName}
          changeManagerList={data.changeManagerList}
        />
      )}
      <Helmet title={titleConfigs.reservationUpdateTitle} />
      <div className={styles.container}>
        <div className={styles.heading}>예약 수정</div>
        {data ? (
          <>
            <div className={styles.label}>기본 정보</div>
            <div className={styles['input-wrapper']}>
              <Input
                label="산모명"
                width={180}
                placeholder="산모명을 입력해주세요"
                value={data.userName}
                disabled
              />
            </div>
            <div className={styles['input-list-wrapper']}>
              <Input
                maxLength={3}
                label="연락처"
                width={78}
                value={data.phone.split('-')[0]}
                disabled
              />
              <div className={styles.bar}>-</div>
              <Input maxLength={4} width={78} value={data.phone.split('-')[1]} disabled />
              <div className={styles.bar}>-</div>
              <Input maxLength={4} width={78} value={data.phone.split('-')[2]} disabled />
            </div>
            <div className={styles['input-list-wrapper']}>
              <Input
                label="주민등록번호"
                width={180}
                value={fullRegNumFront}
                maxLength={6}
                onChange={({ target: { value } }) => setFullRegNumFront(onlyNumber(value))}
              />
              <div className={styles.bar}>-</div>
              <Input
                width={180}
                value={fullRegNumBack}
                inputType="password"
                maxLength={7}
                onChange={({ target: { value } }) => setFullRegNumBack(onlyNumber(value))}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                label="파견 주소"
                placeholder="파견 주소를 입력해주세요"
                value={address}
                onChange={({ target: { value } }) => setAddress(value)}
              />
            </div>
            <div className={styles['checkbox-section']} style={{ marginBottom: 0 }}>
              <div className={styles['content-label']}>조리 장소</div>
              <div className={styles['checkbox-list-wrapper']}>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="자가" active={placeToBeServiced} setter={setPlaceToBeServiced} />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox
                    text="친정댁"
                    active={placeToBeServiced}
                    setter={setPlaceToBeServiced}
                  />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="시댁" active={placeToBeServiced} setter={setPlaceToBeServiced} />
                </div>
              </div>
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>기타 정보</div>
            <div className={styles['checkbox-section']}>
              <div className={styles['content-label']}>출산 여부</div>
              <div className={styles['checkbox-list-wrapper']}>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="O" active={isBirth} setter={setIsBirth} />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="X" active={isBirth} setter={setIsBirth} />
                </div>
              </div>
            </div>
            {isBirth === 'O' && (
              <div className={styles['checkbox-section']}>
                <div className={styles['content-label']}>출산 형태</div>
                <div className={styles['checkbox-list-wrapper']}>
                  <div className={styles['checkbox-wrapper']}>
                    <Radiobox text="자연분만" active={birthType} setter={setBirthType} />
                  </div>
                  <div className={styles['checkbox-wrapper']}>
                    <Radiobox text="제왕절개" active={birthType} setter={setBirthType} />
                  </div>
                </div>
              </div>
            )}
            {isBirth === 'O' ? (
              <>
                <div className={styles['checkbox-section']}>
                  <div className={styles['content-label']}>병원 입원 여부</div>
                  <div className={styles['checkbox-list-wrapper']}>
                    <div className={styles['checkbox-wrapper']}>
                      <Radiobox text="O" active={useHospital} setter={setUseHospital} />
                    </div>
                    <div className={styles['checkbox-wrapper']}>
                      <Radiobox text="X" active={useHospital} setter={setUseHospital} />
                    </div>
                  </div>
                </div>
                {useHospital === 'O' ? (
                  <div className={styles['input-wrapper']}>
                    <Input
                      label="병원 퇴원일"
                      width={180}
                      placeholder="2021.xx.xx으로 입력"
                      value={hospitalEndDate}
                      onChange={({ target: { value } }) => setHospitalEndDate(value)}
                    />
                  </div>
                ) : null}
              </>
            ) : null}
            <div className={styles['checkbox-section']}>
              <div className={styles['content-label']}>조리원 이용 여부</div>
              <div className={styles['checkbox-list-wrapper']}>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="O" active={useCareCenter} setter={setUseCareCenter} />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="X" active={useCareCenter} setter={setUseCareCenter} />
                </div>
              </div>
            </div>
            {useCareCenter === 'O' &&
              (isBirth === 'O' ? (
                <>
                  <div className={styles['input-wrapper']}>
                    <Input
                      label="조리원 입원일"
                      width={180}
                      placeholder="2021.xx.xx으로 입력"
                      value={careCenterStartDate}
                      onChange={({ target: { value } }) => setCareCenterStartDate(value)}
                    />
                  </div>
                  <div className={styles['input-wrapper']}>
                    <Input
                      label="조리원 퇴원일"
                      width={180}
                      placeholder="2021.xx.xx으로 입력"
                      value={careCenterEndDate}
                      onChange={({ target: { value } }) => setCareCenterEndDate(value)}
                    />
                  </div>
                </>
              ) : (
                <div className={styles['dropdown-section']}>
                  <div className={styles['content-label']}>조리원 이용 기간</div>
                  <div className={styles['dropdown-list-wrapper']}>
                    <div className={styles['dropdown-wrapper']}>
                      <Dropdown
                        value={careCenterDuration}
                        setter={setCareCenterDuration}
                        valueSets={configs.DISPATCH_PERIOD}
                        placeholder="선택"
                      />
                    </div>
                  </div>
                </div>
              ))}
            <div className={styles['checkbox-section']}>
              <div className={styles['content-label']}>수유 형태</div>
              <div className={styles['checkbox-list-wrapper']}>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="모유" active={lactationType} setter={setLactationType} />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="분유" active={lactationType} setter={setLactationType} />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="혼합형" active={lactationType} setter={setLactationType} />
                </div>
              </div>
            </div>
            <div className={styles['checkbox-section']}>
              <div className={styles['content-label']}>애완동물</div>
              <div className={styles['checkbox-list-wrapper']}>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="없음" active={animalType} setter={setAnimalType} />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="개" active={animalType} setter={setAnimalType} />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="고양이" active={animalType} setter={setAnimalType} />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="기타" active={animalType} setter={setAnimalType} />
                </div>
              </div>
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>자녀 및 기타 가족 정보</div>
            <div className={styles['input-wrapper']}>
              <Input
                width={282}
                placeholder="숫자만 입력"
                value={preschooler}
                onChange={({ target: { value } }) => setPreschooler(onlyNumber(value))}
                label="24개월 미만 아동"
              />
              <div className={styles.extra}>명</div>
              <div className={styles.cost}>
                {preschooler && extraCostList
                  ? `${(
                      extraCostList.preschoolerCost * preschooler
                    ).toLocaleString()}원 (1일 기준 가격)`
                  : null}
              </div>
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                width={282}
                placeholder="숫자만 입력"
                value={kindergartener}
                onChange={({ target: { value } }) => setKindergartener(onlyNumber(value))}
                label="미취학 아동"
              />
              <div className={styles.extra}>명</div>
              <div className={styles.cost}>
                {kindergartener && extraCostList
                  ? `${(
                      extraCostList.kindergartenerCost * kindergartener
                    ).toLocaleString()}원 (1일 기준 가격)`
                  : null}
              </div>
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                width={282}
                placeholder="숫자만 입력"
                value={schooler}
                onChange={({ target: { value } }) => setSchooler(onlyNumber(value))}
                label="취학 아동"
              />
              <div className={styles.extra}>명</div>
              <div className={styles.cost}>
                {schooler && extraCostList
                  ? `${(extraCostList.schoolerCost * schooler).toLocaleString()}원 (1일 기준 가격)`
                  : null}
              </div>
            </div>
            <div className={styles['input-wrapper']} style={{ marginBottom: 0 }}>
              <Input
                width={282}
                placeholder="숫자만 입력"
                value={extraFamily}
                onChange={({ target: { value } }) => setExtraFamily(onlyNumber(value))}
                label="기타 가족"
              />
              <div className={styles.extra}>명</div>
              <div className={styles.cost}>
                {extraFamily && extraCostList
                  ? `${(
                      extraCostList.extraFamilyCost * extraFamily
                    ).toLocaleString()}원 (1일 기준 가격)`
                  : null}
              </div>
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>예약 정보</div>
            <div className={styles['input-wrapper']}>
              <Input
                label="출산 예정일"
                width={180}
                placeholder="20xx.xx.xx으로 입력"
                value={birthExpectedDate}
                onChange={({ target: { value } }) => setBirthExpectedDate(value)}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                label="파견 예정일"
                width={180}
                placeholder="20xx.xx.xx으로 입력"
                value={serviceStartDate}
                onChange={({ target: { value } }) => setserviceStartDate(value)}
              />
            </div>
            <div className={styles['dropdown-section']}>
              <div className={styles['content-label']}>이용 기간</div>
              <div className={styles['dropdown-list-wrapper']}>
                <div className={styles['dropdown-wrapper']}>
                  <Dropdown
                    value={serviceDuration}
                    setter={setServiceDuration}
                    valueSets={configs.DISPATCH_PERIOD}
                    placeholder="선택"
                    handleClick={handleExpectedDate}
                  />
                </div>
              </div>
            </div>
            <div className={styles['content-label']}>이용 종료일 (*자동 입력됩니다)</div>
            <div className={styles['input-wrapper']} style={{ marginBottom: 0 }}>
              <Input readOnly width={180} value={serviceEndDate} />
              {serviceEndDate ? (
                <>
                  <div style={{ marginLeft: 10 }}>
                    <MiniButton
                      text="-1일"
                      onClick={() =>
                        setServiceEndDate(
                          dateFormat(
                            new Date(serviceEndDate).setDate(
                              new Date(serviceEndDate).getDate() - 1,
                            ),
                          ),
                        )
                      }
                    />
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    <MiniButton
                      text="+1일"
                      onClick={() =>
                        setServiceEndDate(
                          dateFormat(
                            new Date(serviceEndDate).setDate(
                              new Date(serviceEndDate).getDate() + 1,
                            ),
                          ),
                        )
                      }
                    />
                  </div>
                </>
              ) : null}
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>등급 · 케어 · 요금</div>
            <div className={styles['checkbox-section']}>
              <div className={styles['content-label']}>바우처 여부</div>
              <div className={styles['checkbox-list-wrapper']}>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox
                    text="O"
                    active={isVoucher}
                    setter={setIsVoucher}
                    onChange={handleResetRank}
                  />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox
                    text="X"
                    active={isVoucher}
                    setter={setIsVoucher}
                    onChange={handleResetRank}
                  />
                </div>
              </div>
            </div>
            <div className={styles['dropdown-section']}>
              <div className={styles['content-label']}>등급 유형</div>
              <div className={styles['dropdown-list-wrapper']}>
                <div className={styles['dropdown-wrapper']}>
                  <Dropdown
                    handleClick={() => handleClickRankFront}
                    value={rankFront}
                    setter={setRankFront}
                    valueSets={
                      isVoucher === 'O'
                        ? Object.keys(configs.RANK_TYPES)
                        : Object.keys(configs.NORMAL_RANK_TYPES)
                    }
                    placeholder="선택"
                  />
                </div>
                <div className={styles['dropdown-wrapper']}>
                  <Dropdown
                    value={rankCenter}
                    setter={setRankCenter}
                    valueSets={
                      rankFront
                        ? isVoucher === 'O'
                          ? Object.keys(configs.RANK_TYPES[rankFront])
                          : configs.NORMAL_RANK_TYPES[rankFront]
                        : []
                    }
                    placeholder="선택"
                  />
                </div>
                {isVoucher === 'O' && rankFront !== 'C' ? (
                  <div className={styles['dropdown-wrapper']}>
                    <Dropdown
                      value={rankBack}
                      setter={setRankBack}
                      valueSets={
                        rankFront && rankCenter ? configs.RANK_TYPES[rankFront][rankCenter] : []
                      }
                      placeholder="선택"
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles['checkbox-section']}>
              <div className={styles['content-label']}>케어 형태</div>
              <div className={styles['checkbox-list-wrapper']}>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="출퇴근형" active={careType} setter={setCareType} />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox text="입주형" active={careType} setter={setCareType} />
                </div>
              </div>
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                readOnly
                width={282}
                value={serviceCost}
                // onChange={({ target: { value } }) => setServiceCost(onlyNumber(value))}
                label="서비스 기본요금 (*자동 입력됩니다)"
              />
              <div className={styles.extra}>원</div>
            </div>
            <div className={styles['input-wrapper']} style={{ marginBottom: 48 }}>
              <Input
                width={282}
                placeholder="숫자만 입력"
                value={extraCost}
                onChange={({ target: { value } }) => setExtraCost(onlyNumber(value))}
                label="추가요금"
              />
              <div className={styles.extra}>원</div>
            </div>
            <div className={styles['input-wrapper']} style={{ marginBottom: 48 }}>
              <Input
                readOnly
                width={282}
                value={revenueCost}
                // onChange={({ target: { value } }) => setRevenueCost(onlyNumber(value))}
                label="정부 지원금 (*자동 입력됩니다)"
              />
              <div className={styles.extra}>원</div>
            </div>
            <div className={styles['input-wrapper']} style={{ marginBottom: 0 }}>
              <Input
                readOnly
                width={282}
                value={userCost}
                // onChange={({ target: { value } }) => setUserCost(onlyNumber(value))}
                label="최종 본인부담금 (*자동 입력됩니다)"
              />
              <div className={styles.extra}>원</div>
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>산모 요청사항</div>
            <TextArea
              onChange={({ target: { value } }) => setRequirement(value)}
              value={requirement}
              height={136}
            />
            <div className={styles.divided} />
            <div className={styles.label}>파견 관리사</div>
            <div className={styles['selected-section']}>
              {managersId &&
                managersId.map((manager, index) => {
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
            {isBirth === 'O' && !data.refundRequested ? (
              <ButtonComponent
                onClick={() => setIsOpenModal(true)}
                isPrimary={false}
                text="선택하기"
                buttonWidth={180}
                buttonHeight={46}
              />
            ) : (
              <div className={styles['content-label']}>
                {data.refundRequested
                  ? null
                  : '출산일이 통보된 이후에 관리사를 파견할 수 있습니다.'}
              </div>
            )}
            <div className={styles.divided} />
            <div className={styles['button-wrapper']}>
              <ButtonComponent
                onClick={handleSubmit}
                text="수정"
                buttonWidth={180}
                buttonHeight={46}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.label}>기본 정보</div>
            <div className={styles['content-label']}>산모명</div>
            <div className={styles['input-wrapper']}>
              <Skeleton width={180} height={46} />
            </div>
            <div className={styles['content-label']}>연락처</div>
            <div className={styles['input-list-wrapper']}>
              <Skeleton width={78} height={46} />
              <div className={styles.bar}>-</div>
              <Skeleton width={78} height={46} />
              <div className={styles.bar}>-</div>
              <Skeleton width={78} height={46} />
            </div>
            <div className={styles['content-label']}>주민등록번호</div>
            <div className={styles['input-list-wrapper']}>
              <Skeleton width={78} height={46} />
              <div className={styles.bar}>-</div>
              <Skeleton width={78} height={46} />
              <div className={styles.bar}>-</div>
              <Skeleton width={78} height={46} />
            </div>
            <div className={styles['content-label']}>파견 주소</div>
            <div className={styles['input-wrapper']}>
              <Skeleton width={792} height={46} />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>등급 · 케어 정보</div>
            <div className={styles['dropdown-section']}>
              <div className={styles['content-label']}>등급 유형</div>
              <div className={styles['dropdown-list-wrapper']}>
                <Skeleton width={78} height={46} style={{ marginRight: '24px' }} />
                <Skeleton width={78} height={46} style={{ marginRight: '24px' }} />
                <Skeleton width={78} height={46} style={{ marginRight: '24px' }} />
              </div>
            </div>
            <div className={styles['checkbox-section']}>
              <div className={styles['content-label']}>케어 형태</div>
              <div className={styles['checkbox-list-wrapper']}>
                <Skeleton width={282} height={46} />
              </div>
            </div>
            <div className={styles['content-label']}>파견 주소</div>
            <div className={styles['input-wrapper']} style={{ marginBottom: 0 }}>
              <Skeleton width={282} height={46} />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>기타 정보</div>
            <div className={styles['checkbox-section']}>
              <div className={styles['content-label']}>출산 형태</div>
              <div className={styles['checkbox-list-wrapper']}>
                <Skeleton width={282} height={46} />
              </div>
            </div>
            <div className={styles['checkbox-section']}>
              <div className={styles['content-label']}>수유 형태</div>
              <div className={styles['checkbox-list-wrapper']}>
                <Skeleton width={423} height={46} />
              </div>
            </div>
            <div className={styles.label}>기타 정보</div>
            <div className={styles['checkbox-section']}>
              <div className={styles['content-label']}>애완동물</div>
              <div className={styles['checkbox-list-wrapper']}>
                <Skeleton width={282} height={46} />
              </div>
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>산모 요청사항</div>
            <div className={styles['textarea-wrapper']}>
              <Skeleton width={792} height={138} />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>예약 정보</div>
            <div className={styles['content-label']}>출산 예정일</div>
            <div className={styles['input-wrapper']}>
              <Skeleton width={180} height={46} />
            </div>
            <div className={styles['content-label']}>파견 예정일</div>
            <div className={styles['input-wrapper']}>
              <Skeleton width={180} height={46} />
            </div>
            <div className={styles['content-label']}>이용 기간</div>
            <div className={styles['input-wrapper']}>
              <Skeleton width={80} height={46} />
            </div>
            <div className={styles['content-label']}>이용 종료일 (*자동 입력됩니다)</div>
            <div className={styles['input-wrapper']}>
              <Skeleton width={180} height={46} />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>파견 관리사</div>
            <div className={styles['selected-section']}>
              <div className={styles['selected-wrapper']}>
                <Skeleton
                  width={78}
                  height={78}
                  style={{ borderRadius: '50%', marginBottom: '12px' }}
                />
                <Skeleton width={42} height={14} />
              </div>
            </div>
            <div className={styles.divided} />
          </>
        )}
      </div>
    </>
  );
};

export default ReservationUpdatePage;
