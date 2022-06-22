/* eslint-disable no-return-assign */
/* eslint-disable operator-linebreak */

import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import ButtonComponent from 'components/button';
import Helmet from 'components/helmet';
import Input from 'components/input';
import Dropdown from 'components/dropdown';
import ThumbnailSelector from 'components/thumbnailSelector';
import CostUpdateTable from 'components/table/costUpdate';

import showItem from 'utils/common/show';
import updateCompany from 'utils/information/update';
import onlyNumber from 'utils/input/onlyNumber';
import verifyFileSize from 'utils/input/verifyFileSize';
import checkObjectFull from 'utils/format/checkObjectFull';

import errorConfigs from 'configs/error';
import titleConfigs from 'configs/title';
import dataConfigs from 'configs/data';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const Information = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [companyId, setCompanyId] = useState();
  const [beforeThumbnail, setBeforeThumbnail] = useState();
  const [thumbnail, setThumbnail] = useState();
  const [companyName, setCompanyName] = useState();
  const [phoneFront, setPhoneFront] = useState();
  const [phoneCenter, setPhoneCenter] = useState();
  const [phoneBack, setPhoneBack] = useState();
  const [registerNumber, setRegisterNumber] = useState();
  const [address, setAddress] = useState();
  const [dispatchableArea, setDispatchableArea] = useState([]);
  const [areaFront, setAreaFront] = useState();
  const [areaCenter, setAreaCenter] = useState();
  const [areaBack, setAreaBack] = useState();

  const [bankName, setBankName] = useState();
  const [accountHolderName, setAccountHolderName] = useState();
  const [accountNumber, setAccountNumber] = useState();

  const [homepage, setHomepage] = useState();
  const [blog, setBlog] = useState();
  const [momcafe, setMomcafe] = useState();

  const [preschoolerCost, setPreschoolerCost] = useState();
  const [kindergartenerCost, setKindergartenerCost] = useState();
  const [schoolerCost, setSchoolerCost] = useState();
  const [extraFamilyCost, setExtraFamilyCost] = useState();

  const defaultArray = new Array(5).fill(null);
  const gradesObj = {};
  dataConfigs.gradesType.forEach((e) => (gradesObj[e] = defaultArray));

  const normalGradesObj = {};
  dataConfigs.normalType.forEach((e) => (normalGradesObj[e] = defaultArray));

  const [serviceCostInfo, setServiceCostInfo] = useState({ ...gradesObj, ...normalGradesObj });
  const [revenueCostInfo, setRevenueCostInfo] = useState({ ...gradesObj });
  const [userCostInfo, setUserCostInfo] = useState({ ...gradesObj });

  const handleSubmit = async () => {
    if (
      !companyName ||
      !phoneFront ||
      !phoneCenter ||
      !phoneBack ||
      !registerNumber ||
      !address ||
      !dispatchableArea ||
      !preschoolerCost ||
      !kindergartenerCost ||
      !schoolerCost ||
      !extraFamilyCost ||
      !checkObjectFull(revenueCostInfo) ||
      !checkObjectFull(userCostInfo)
    ) {
      return alert('모든 항목을 채워주세요');
    }
    if (registerNumber.length !== 10) {
      return alert(errorConfigs.invalidRegisterNumber.msg);
    }
    if (window.confirm('저장하시겠습니까?')) {
      const companyInfo = {
        companyId,
        beforeThumbnail,
        thumbnail,
        companyName,
        phone: `${phoneFront}-${phoneCenter}-${phoneBack}`,
        registerNumber,
        address,
        dispatchableArea,
        homepage,
        blog,
        momcafe,
        preschoolerCost,
        kindergartenerCost,
        schoolerCost,
        extraFamilyCost,
        serviceCostInfo,
        revenueCostInfo,
        userCostInfo,
      };

      const res = await updateCompany(companyInfo);

      if (!res) {
        return alert('잠시 후 시도해주세요');
      }
      alert('정상 반영되었습니다.');
      router.push('/information');
    }
  };

  const handleDelete = (index) => () => {
    if (window.confirm('삭제하시겠습니까?')) {
      const newArr = dispatchableArea;
      newArr.splice(index, 1);
      setDispatchableArea([...newArr]);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const { uid } = auth.currentUser;
    setCompanyId(uid);

    const onSuccess = async (userInfo) => {
      setLoading(false);

      setCompanyName(userInfo.companyName);
      setRegisterNumber(userInfo.registerNumber);
      setAddress(userInfo.address);

      setAccountHolderName(userInfo.accountHolderName);
      setAccountNumber(userInfo.accountNumber);
      setBankName(userInfo.bankName);

      if (userInfo.thumbnail) {
        setThumbnail(userInfo.thumbnail);
        setBeforeThumbnail(userInfo.thumbnail);
      }
      if (userInfo.phone) {
        setPhoneFront(userInfo.phone.split('-')[0]);
        setPhoneCenter(userInfo.phone.split('-')[1]);
        setPhoneBack(userInfo.phone.split('-')[2]);
      }
      if (userInfo.dispatchableArea && userInfo.dispatchableArea.length) {
        setDispatchableArea(userInfo.dispatchableArea);
      }
      if (userInfo.revenueCostInfo) {
        setRevenueCostInfo(userInfo.revenueCostInfo);
      }
      if (userInfo.serviceCostInfo) {
        setServiceCostInfo(userInfo.serviceCostInfo);
      }
      if (userInfo.userCostInfo) {
        setUserCostInfo(userInfo.userCostInfo);
      }
      if (userInfo.preschoolerCost) {
        setPreschoolerCost(userInfo.preschoolerCost);
      }
      if (userInfo.kindergartenerCost) {
        setKindergartenerCost(userInfo.kindergartenerCost);
      }
      if (userInfo.schoolerCost) {
        setSchoolerCost(userInfo.schoolerCost);
      }
      if (userInfo.extraFamilyCost) {
        setExtraFamilyCost(userInfo.extraFamilyCost);
      }
    };

    showItem({ collectionName: 'Company', docId: uid }, onSuccess);
  }, []);

  const handleThumbnail = (file) => {
    if (verifyFileSize(file)) {
      setThumbnail(file);
    } else {
      return alert('1장당 2MB 이하의 이미지만 올리실 수 있습니다');
    }
  };

  useEffect(() => {
    if (areaFront && areaCenter && areaBack) {
      const isInclude = dispatchableArea.includes(`${areaFront} ${areaCenter} ${areaBack}`);

      if (isInclude) {
        alert('이미 동일한 지역이 있습니다.');
      } else {
        setDispatchableArea([...dispatchableArea, `${areaFront} ${areaCenter} ${areaBack}`]);
      }

      setAreaFront('');
      setAreaCenter('');
      setAreaBack('');
    }
  }, [areaBack]);

  return (
    <>
      <Helmet title={titleConfigs.companyUpdateTitle} />
      <div className={styles.container}>
        <div className={styles.header}>업체정보 수정</div>
        {!loading ? (
          <>
            <div className={styles['thumbnail-section']}>
              <ThumbnailSelector file={thumbnail} setter={handleThumbnail} />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>기본 정보</div>
            <div className={styles['input-wrapper']}>
              <Input
                label="업체명"
                width={180}
                placeholder="업체명을 입력해주세요"
                value={companyName}
                onChange={({ target: { value } }) => setCompanyName(value)}
              />
            </div>
            <div className={styles['input-list-wrapper']}>
              <Input
                label="연락처"
                width={78}
                value={phoneFront}
                maxLength={3}
                onChange={({ target: { value } }) => setPhoneFront(onlyNumber(value))}
              />
              <div className={styles.bar}>-</div>
              <Input
                width={78}
                value={phoneCenter}
                maxLength={4}
                onChange={({ target: { value } }) => setPhoneCenter(onlyNumber(value))}
              />
              <div className={styles.bar}>-</div>
              <Input
                width={78}
                value={phoneBack}
                maxLength={4}
                onChange={({ target: { value } }) => setPhoneBack(onlyNumber(value))}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                width={180}
                label="사업자등록번호"
                placeholder="번호를 입력해주세요"
                value={registerNumber}
                maxLength={10}
                onChange={({ target: { value } }) => setRegisterNumber(onlyNumber(value))}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                label="주소"
                placeholder="주소를 입력해주세요"
                value={address}
                onChange={({ target: { value } }) => setAddress(value)}
                width={600}
              />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>계좌 정보</div>
            <div className={styles['input-wrapper']}>
              <Input
                label="은행명"
                placeholder="은행명을 입력해주세요"
                value={bankName}
                onChange={({ target: { value } }) => setBankName(value)}
                width={200}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                label="예금주"
                placeholder="예금주를 입력해주세요"
                value={accountHolderName}
                onChange={({ target: { value } }) => setAccountHolderName(value)}
                width={200}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                label="계좌번호"
                placeholder="계좌번호를 입력해주세요"
                value={accountNumber}
                onChange={({ target: { value } }) => setAccountNumber(value)}
                width={200}
              />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>SNS 정보</div>
            <div className={styles['input-wrapper']}>
              <Input
                label="홈페이지"
                placeholder="홈페이지를 입력해주세요"
                value={homepage}
                onChange={({ target: { value } }) => setHomepage(value)}
                width={600}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                label="블로그"
                placeholder="블로그 입력해주세요"
                value={blog}
                onChange={({ target: { value } }) => setBlog(value)}
                width={600}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                label="맘카페 제휴"
                placeholder="맘카페 제휴 이름을 입력해주세요"
                value={momcafe}
                onChange={({ target: { value } }) => setMomcafe(value)}
                width={600}
              />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>파견 가능 지역</div>
            <div className={styles['dropdown-section']}>
              <div className={styles['contents-label']}>
                파견 가능 지역을 입력해주세요 (추후 변경 가능합니다)
              </div>
              <div className={styles['dropdown-list-wrapper']}>
                <div className={styles['dropdown-wrapper-front']}>
                  <Dropdown
                    value={areaFront}
                    setter={setAreaFront}
                    valueSets={Object.keys(dataConfigs.LOCATION)}
                    placeholder="시 · 도"
                  />
                </div>
                <div className={styles['dropdown-wrapper-center']}>
                  <Dropdown
                    value={areaCenter}
                    setter={setAreaCenter}
                    valueSets={areaFront ? Object.keys(dataConfigs.LOCATION[areaFront]) : []}
                    placeholder="군 · 구"
                  />
                </div>
                <div className={styles['dropdown-wrapper-back']}>
                  <Dropdown
                    value={areaBack}
                    setter={setAreaBack}
                    valueSets={
                      areaFront && areaCenter ? dataConfigs.LOCATION[areaFront][areaCenter] : []
                    }
                    placeholder="동 · 읍 · 면"
                  />
                </div>
              </div>
              {dispatchableArea.map((area, index) => (
                <div key={String(index)} className={styles['area-wrapper']}>
                  <div className={styles['dropdown-wrapper-front']}>{area.split(' ')[0]}</div>
                  <div className={styles['dropdown-wrapper-center']}>{area.split(' ')[1]}</div>
                  <div className={styles['dropdown-wrapper-back']}>{area.split(' ')[2]}</div>
                  <button type="button" className={styles.button} onClick={handleDelete(index)}>
                    삭제
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>추가 요금 정보</div>
            <div className={styles['contents-wrapper']}>
              <div className={styles['cost-wrapper']}>
                <Input
                  width={282}
                  label="24개월 미만 아동"
                  value={preschoolerCost}
                  onChange={({ target: { value } }) => setPreschoolerCost(onlyNumber(value))}
                />
                <div className={styles.extra}>원</div>
              </div>
              <div className={styles['cost-wrapper']}>
                <Input
                  width={282}
                  label="미취학 아동"
                  value={kindergartenerCost}
                  onChange={({ target: { value } }) => setKindergartenerCost(onlyNumber(value))}
                />
                <div className={styles.extra}>원</div>
              </div>
              <div className={styles['cost-wrapper']}>
                <Input
                  width={282}
                  label="취학 아동"
                  value={schoolerCost}
                  onChange={({ target: { value } }) => setSchoolerCost(onlyNumber(value))}
                />
                <div className={styles.extra}>원</div>
              </div>
              <div className={styles['cost-wrapper']}>
                <Input
                  width={282}
                  label="가족"
                  value={extraFamilyCost}
                  onChange={({ target: { value } }) => setExtraFamilyCost(onlyNumber(value))}
                />
                <div className={styles.extra}>원</div>
              </div>
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>서비스 요금 정보</div>
            <div className={styles['cost-label']}>일반 서비스 요금표</div>
            <div className={styles['table-wrapper']}>
              <CostUpdateTable
                type="normal"
                serviceCostInfo={serviceCostInfo}
                setServiceCostInfo={setServiceCostInfo}
              />
            </div>
            <div className={styles.border} />
            <div className={styles['cost-label']}>바우처 요금표</div>
            <div className={styles['table-wrapper']}>
              <CostUpdateTable
                type="voucher"
                userCostInfo={userCostInfo}
                revenueCostInfo={revenueCostInfo}
                serviceCostInfo={serviceCostInfo}
                setUserCostInfo={setUserCostInfo}
                setRevenueCostInfo={setRevenueCostInfo}
                setServiceCostInfo={setServiceCostInfo}
              />
            </div>
            <div className={styles.divided} />
            <div className={styles['action-section']}>
              <ButtonComponent
                onClick={handleSubmit}
                text="저장"
                buttonHeight={46}
                buttonWidth={180}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles['thumbnail-section']}>
              <Skeleton width={180} height={180} />
            </div>
            <div className={styles.divided} />
            <div className={styles['table-wrapper']}>
              <Skeleton width={588} height={230} />
            </div>
            <div className={styles['table-wrapper']}>
              <Skeleton width={588} height={92} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Information;
