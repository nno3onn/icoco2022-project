/* eslint-disable object-curly-newline */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from '@firebase/auth';

import ButtonComponent from 'components/button';
import Helmet from 'components/helmet';
import Input from 'components/input';
import Dropdown from 'components/dropdown';
import Radiobox from 'components/radiobox';
import TextArea from 'components/textArea';
import MiniButton from 'components/button/mini';

import configs from 'configs/data';

import onlyNumber from 'utils/input/onlyNumber';
import verifyDate from 'utils/input/verifyDate';
import createReservation from 'utils/reservation/create';
import dateFormat from 'utils/format/getYYYYMMDD';
import checkDuplication from 'utils/reservation/duplicate';
import showItem from 'utils/common/show';

import titleConfigs from 'configs/title';

import styles from './index.module.scss';

const ReservationCreatePage = () => {
  const router = useRouter();

  const [extraCostList, setExtraCostList] = useState();

  // 기본정보
  const [userName, setUserName] = useState('');
  const [phoneFront, setPhoneFront] = useState('');
  const [phoneCenter, setPhoneCenter] = useState('');
  const [phoneBack, setPhoneBack] = useState('');
  const [fullRegNumFront, setFullRegNumFront] = useState('');
  const [fullRegNumBack, setFullRegNumBack] = useState('');
  const [address, setAddress] = useState('');
  const [isReadyTocheck, setIsReadyTocheck] = useState(false);
  const [isCheckDuplication, setIsCheckDuplication] = useState(false);
  const [placeToBeServiced, setPlaceToBeServiced] = useState('자가');

  // 등급 케어 요금
  const [rankFront, setRankFront] = useState('');
  const [rankCenter, setRankCenter] = useState('');
  const [rankBack, setRankBack] = useState('');
  const [isVoucher, setIsVoucher] = useState('O');
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

  // 회사 요금 정보
  const [serviceCostInfo, setServiceCostInfo] = useState();
  const [revenueCostInfo, setRevenueCostInfo] = useState();

  const handleSubmit = () => {
    if (!isCheckDuplication) {
      return alert('예약 중복을 확인해주세요.');
    }
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

    if (window.confirm('예약을 추가하시겠습니까?')) {
      const reservationInfo = {
        userName,
        phone: `${phoneFront}-${phoneCenter}-${phoneBack}`,
        fullRegNum: `${fullRegNumFront}-${fullRegNumBack}`,
        address,
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
        useCareCenter,
        careCenterStartDate,
        careCenterEndDate,
        careCenterDuration,
        useHospital,
        hospitalEndDate,
      };

      const onSuccess = (reservationNumber) => {
        alert('정상 반영되었습니다.');
        router.push(`/reservation/${reservationNumber}`);
      };

      createReservation(reservationInfo, onSuccess);
    }
  };

  useEffect(() => {
    if (userName && phoneFront && phoneCenter && phoneBack) {
      if (phoneFront.length < 3 || phoneCenter.length < 3 || phoneBack.length < 3) {
        setIsReadyTocheck(false);
      } else {
        setIsReadyTocheck(true);
      }
    }
  }, [userName, phoneFront, phoneCenter, phoneBack]);

  useEffect(() => {
    if (serviceCost && revenueCost) {
      setUserCost(Number(serviceCost) + Number(extraCost) - Number(revenueCost));
    } else {
      setUserCost();
    }
  }, [extraCost]);

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

  const handleResetRank = () => {
    setRankFront('');
    setRankCenter('');
    setRankBack('');
  };

  const handleCheck = async () => {
    if (!isReadyTocheck) return;

    if (phoneFront.substring(0, 2) !== '01') return alert('핸드폰 번호를 확인해주세요.');

    const { ck, id } = await checkDuplication({
      userName,
      phone: `${phoneFront}-${phoneCenter}-${phoneBack}`,
      moreThanNumber: 1,
    });

    if (ck) {
      alert('이미 예약된 정보가 있습니다. 예약된 예약 페이지로 넘어갑니다.');
      return router.push(`/reservation/${id}`);
    }
    setIsReadyTocheck(false);
    setIsCheckDuplication(true);
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

  useEffect(() => {
    const { uid } = getAuth().currentUser;

    const onSuccess = (data) => {
      const { preschoolerCost, kindergartenerCost, schoolerCost, extraFamilyCost } = data;
      setExtraCostList({
        preschoolerCost: preschoolerCost || 0,
        kindergartenerCost: kindergartenerCost || 0,
        schoolerCost: schoolerCost || 0,
        extraFamilyCost: extraFamilyCost || 0,
      });

      if (data.serviceCostInfo) {
        setServiceCostInfo(data.serviceCostInfo);
      }
      if (data.revenueCostInfo) {
        setRevenueCostInfo(data.revenueCostInfo);
      }
    };

    showItem({ collectionName: 'Company', docId: uid }, onSuccess);
  }, []);

  return (
    <>
      <Helmet title={titleConfigs.reservationCreateTitle} />
      <div className={styles.container}>
        <div className={styles.heading}>예약 추가</div>
        <div className={styles.label}>기본 정보</div>
        <div className={styles['input-wrapper']}>
          <Input
            label="산모명"
            width={180}
            placeholder="산모명을 입력해주세요"
            value={userName}
            disabled={isCheckDuplication}
            onChange={({ target: { value } }) => setUserName(value)}
          />
        </div>
        <div className={styles['input-list-wrapper']}>
          <Input
            maxLength={3}
            label="연락처"
            width={78}
            value={phoneFront}
            disabled={isCheckDuplication}
            onChange={({ target: { value } }) => setPhoneFront(onlyNumber(value))}
          />
          <div className={styles.bar}>-</div>
          <Input
            maxLength={4}
            width={78}
            value={phoneCenter}
            disabled={isCheckDuplication}
            onChange={({ target: { value } }) => setPhoneCenter(onlyNumber(value))}
          />
          <div className={styles.bar}>-</div>
          <Input
            maxLength={4}
            width={78}
            value={phoneBack}
            disabled={isCheckDuplication}
            onChange={({ target: { value } }) => setPhoneBack(onlyNumber(value))}
          />
          <div style={{ marginLeft: '40px' }}>
            <ButtonComponent
              text={
                isCheckDuplication ? (
                  <div style={{ color: '#503aa9' }}>중복 확인 완료</div>
                ) : (
                  '예약 중복 확인'
                )
              }
              onClick={handleCheck}
              buttonWidth={180}
              buttonHeight={46}
              isPrimary={isReadyTocheck}
            />
          </div>
        </div>

        {isCheckDuplication ? (
          <>
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
                {extraCostList && preschooler
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
                {extraCostList && kindergartener
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
                {extraCostList && schooler
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
                {extraCostList && extraFamily
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
            <div className={styles['input-wrapper']}>
              <Input
                width={282}
                placeholder="숫자만 입력"
                value={extraCost}
                onChange={({ target: { value } }) => setExtraCost(onlyNumber(value))}
                label="추가요금"
              />
              <div className={styles.extra}>원</div>
            </div>
            <div className={styles['input-wrapper']}>
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
            <div className={styles['button-wrapper']}>
              <ButtonComponent
                onClick={handleSubmit}
                text="확인"
                buttonWidth={180}
                buttonHeight={46}
              />
            </div>
          </>
        ) : (
          <div className={styles.sub}>예약 중복을 확인하셔야 예약을 진행할 수 있습니다.</div>
        )}
      </div>
    </>
  );
};

export default ReservationCreatePage;
