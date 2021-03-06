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
      return alert('?????? ????????? ???????????????');
    }
    if (registerNumber.length !== 10) {
      return alert(errorConfigs.invalidRegisterNumber.msg);
    }
    if (window.confirm('?????????????????????????')) {
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
        return alert('?????? ??? ??????????????????');
      }
      alert('?????? ?????????????????????.');
      router.push('/information');
    }
  };

  const handleDelete = (index) => () => {
    if (window.confirm('?????????????????????????')) {
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
      return alert('1?????? 2MB ????????? ???????????? ????????? ??? ????????????');
    }
  };

  useEffect(() => {
    if (areaFront && areaCenter && areaBack) {
      const isInclude = dispatchableArea.includes(`${areaFront} ${areaCenter} ${areaBack}`);

      if (isInclude) {
        alert('?????? ????????? ????????? ????????????.');
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
        <div className={styles.header}>???????????? ??????</div>
        {!loading ? (
          <>
            <div className={styles['thumbnail-section']}>
              <ThumbnailSelector file={thumbnail} setter={handleThumbnail} />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>?????? ??????</div>
            <div className={styles['input-wrapper']}>
              <Input
                label="?????????"
                width={180}
                placeholder="???????????? ??????????????????"
                value={companyName}
                onChange={({ target: { value } }) => setCompanyName(value)}
              />
            </div>
            <div className={styles['input-list-wrapper']}>
              <Input
                label="?????????"
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
                label="?????????????????????"
                placeholder="????????? ??????????????????"
                value={registerNumber}
                maxLength={10}
                onChange={({ target: { value } }) => setRegisterNumber(onlyNumber(value))}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                label="??????"
                placeholder="????????? ??????????????????"
                value={address}
                onChange={({ target: { value } }) => setAddress(value)}
                width={600}
              />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>?????? ??????</div>
            <div className={styles['input-wrapper']}>
              <Input
                label="?????????"
                placeholder="???????????? ??????????????????"
                value={bankName}
                onChange={({ target: { value } }) => setBankName(value)}
                width={200}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                label="?????????"
                placeholder="???????????? ??????????????????"
                value={accountHolderName}
                onChange={({ target: { value } }) => setAccountHolderName(value)}
                width={200}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                label="????????????"
                placeholder="??????????????? ??????????????????"
                value={accountNumber}
                onChange={({ target: { value } }) => setAccountNumber(value)}
                width={200}
              />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>SNS ??????</div>
            <div className={styles['input-wrapper']}>
              <Input
                label="????????????"
                placeholder="??????????????? ??????????????????"
                value={homepage}
                onChange={({ target: { value } }) => setHomepage(value)}
                width={600}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                label="?????????"
                placeholder="????????? ??????????????????"
                value={blog}
                onChange={({ target: { value } }) => setBlog(value)}
                width={600}
              />
            </div>
            <div className={styles['input-wrapper']}>
              <Input
                label="????????? ??????"
                placeholder="????????? ?????? ????????? ??????????????????"
                value={momcafe}
                onChange={({ target: { value } }) => setMomcafe(value)}
                width={600}
              />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>?????? ?????? ??????</div>
            <div className={styles['dropdown-section']}>
              <div className={styles['contents-label']}>
                ?????? ?????? ????????? ?????????????????? (?????? ?????? ???????????????)
              </div>
              <div className={styles['dropdown-list-wrapper']}>
                <div className={styles['dropdown-wrapper-front']}>
                  <Dropdown
                    value={areaFront}
                    setter={setAreaFront}
                    valueSets={Object.keys(dataConfigs.LOCATION)}
                    placeholder="??? ?? ???"
                  />
                </div>
                <div className={styles['dropdown-wrapper-center']}>
                  <Dropdown
                    value={areaCenter}
                    setter={setAreaCenter}
                    valueSets={areaFront ? Object.keys(dataConfigs.LOCATION[areaFront]) : []}
                    placeholder="??? ?? ???"
                  />
                </div>
                <div className={styles['dropdown-wrapper-back']}>
                  <Dropdown
                    value={areaBack}
                    setter={setAreaBack}
                    valueSets={
                      areaFront && areaCenter ? dataConfigs.LOCATION[areaFront][areaCenter] : []
                    }
                    placeholder="??? ?? ??? ?? ???"
                  />
                </div>
              </div>
              {dispatchableArea.map((area, index) => (
                <div key={String(index)} className={styles['area-wrapper']}>
                  <div className={styles['dropdown-wrapper-front']}>{area.split(' ')[0]}</div>
                  <div className={styles['dropdown-wrapper-center']}>{area.split(' ')[1]}</div>
                  <div className={styles['dropdown-wrapper-back']}>{area.split(' ')[2]}</div>
                  <button type="button" className={styles.button} onClick={handleDelete(index)}>
                    ??????
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>?????? ?????? ??????</div>
            <div className={styles['contents-wrapper']}>
              <div className={styles['cost-wrapper']}>
                <Input
                  width={282}
                  label="24?????? ?????? ??????"
                  value={preschoolerCost}
                  onChange={({ target: { value } }) => setPreschoolerCost(onlyNumber(value))}
                />
                <div className={styles.extra}>???</div>
              </div>
              <div className={styles['cost-wrapper']}>
                <Input
                  width={282}
                  label="????????? ??????"
                  value={kindergartenerCost}
                  onChange={({ target: { value } }) => setKindergartenerCost(onlyNumber(value))}
                />
                <div className={styles.extra}>???</div>
              </div>
              <div className={styles['cost-wrapper']}>
                <Input
                  width={282}
                  label="?????? ??????"
                  value={schoolerCost}
                  onChange={({ target: { value } }) => setSchoolerCost(onlyNumber(value))}
                />
                <div className={styles.extra}>???</div>
              </div>
              <div className={styles['cost-wrapper']}>
                <Input
                  width={282}
                  label="??????"
                  value={extraFamilyCost}
                  onChange={({ target: { value } }) => setExtraFamilyCost(onlyNumber(value))}
                />
                <div className={styles.extra}>???</div>
              </div>
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>????????? ?????? ??????</div>
            <div className={styles['cost-label']}>?????? ????????? ?????????</div>
            <div className={styles['table-wrapper']}>
              <CostUpdateTable
                type="normal"
                serviceCostInfo={serviceCostInfo}
                setServiceCostInfo={setServiceCostInfo}
              />
            </div>
            <div className={styles.border} />
            <div className={styles['cost-label']}>????????? ?????????</div>
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
                text="??????"
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
