/* eslint-disable operator-linebreak */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import LoadingButton from 'components/button/loading';
import Dropdown from 'components/dropdown';
import Helmet from 'components/helmet';
import Input from 'components/input';
import ThumbnailSelector from 'components/thumbnailSelector';
import Radiobox from 'components/radiobox';
import MultiRadiobox from 'components/radiobox/multi';
import FileUploader from 'components/table/fileUploader';
import InfoTable from 'components/table/info';

import getDate from 'utils/time/getDate';
import getYearAndMonth from 'utils/time/getYearAndMonth';
import onlyNumber from 'utils/input/onlyNumber';
import showItem from 'utils/common/show';
import updateManager from 'utils/manager/update';
import getFileData from 'utils/uploads/getData';
import verifyFileSize from 'utils/input/verifyFileSize';

import configs from 'configs/data';
import titleConfigs from 'configs/title';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const ManagerUpdatePage = () => {
  const router = useRouter();
  const managerId = router.query.manager_id;

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState();
  const [otherInfoA, setOtherInfoA] = useState([]);

  const [profileImage, setProfileImage] = useState();
  const [name, setName] = useState('');

  const [phoneFront, setPhoneFront] = useState('');
  const [phoneCenter, setPhoneCenter] = useState('');
  const [phoneBack, setPhoneBack] = useState('');

  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  const [careerStartedYear, setCareerStartedYear] = useState('');
  const [careerStartedMonth, setCareerStartedMonth] = useState('');
  const [careerStartedDay, setCareerStartedDay] = useState('');

  const [dispatchableArea, setDispatchableArea] = useState([]);
  const [areaFront, setAreaFront] = useState('');
  const [areaCenter, setAreaCenter] = useState('');
  const [areaBack, setAreaBack] = useState('');

  const [isCar, setIsCar] = useState('없음');
  const [isResident, setIsResident] = useState('불가능');
  const [isCCTV, setIsCCTV] = useState('미동의');
  const [personality, setPersonality] = useState([]);
  const [specialty, setSpecialty] = useState('');

  const [certName, setCertName] = useState('');
  const [certHealth, setCertHealth] = useState('');
  const [certCrime, setCertCrime] = useState('');
  const [beforeCertFiles, setBeforeCertFiles] = useState([]);

  const handleDelete = (index) => () => {
    if (window.confirm('삭제하시겠습니까?')) {
      const newArr = dispatchableArea;
      newArr.splice(index, 1);
      setDispatchableArea([...newArr]);
    }
  };

  const handleSubmit = () => {
    if (
      !name ||
      !phoneFront ||
      !phoneCenter ||
      !phoneBack ||
      !birthYear ||
      !birthMonth ||
      !birthDay ||
      !careerStartedYear ||
      !careerStartedMonth ||
      !careerStartedDay
    ) {
      alert('모든 항목을 채워주세요');
      return;
    }

    if (window.confirm('수정하시겠습니까?')) {
      setLoading(true);
      const managerInfo = {
        managerId,
        profileImage,
        name,
        dispatchableArea,
        phone: `${phoneFront}-${phoneCenter}-${phoneBack}`,
        birthDate: `${birthYear}.${birthMonth}.${birthDay}`,
        careerStartedDate: `${careerStartedYear}.${careerStartedMonth}.${careerStartedDay}`,
        isCar,
        isResident,
        isCCTV,
        personality,
        certName,
        certHealth,
        certCrime,
        specialty,
        beforeCertFiles,
      };

      const onSuccess = () => {
        alert('정상 반영되었습니다.');
        router.push(`/manager/${managerId}`);
      };

      updateManager(managerInfo, onSuccess);
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

  useEffect(() => {
    const onSuccess = async (manager) => {
      setData(manager);

      setProfileImage(manager.profileImage);
      setName(manager.name);

      setPhoneFront(manager.phone.split('-')[0]);
      setPhoneCenter(manager.phone.split('-')[1]);
      setPhoneBack(manager.phone.split('-')[2]);

      setBirthYear(manager.birthDate.split('.')[0]);
      setBirthMonth(manager.birthDate.split('.')[1]);
      setBirthDay(manager.birthDate.split('.')[2]);

      setCareerStartedYear(manager.careerStartedDate.split('.')[0]);
      setCareerStartedMonth(manager.careerStartedDate.split('.')[1]);
      setCareerStartedDay(manager.careerStartedDate.split('.')[2]);

      setDispatchableArea(manager.dispatchableArea);
      setIsCar(manager.isCar);
      setIsResident(manager.isResident);
      setIsCCTV(manager.isCCTV);
      setPersonality(manager.personality);
      setSpecialty(manager.specialty);

      const n = await getFileData(manager.certName);
      const health = await getFileData(manager.certHealth);
      const crime = await getFileData(manager.certCrime);

      setCertName(n);
      setCertHealth(health);
      setCertCrime(crime);
      setBeforeCertFiles([manager.certName, manager.certHealth, manager.certCrime]);
    };
    showItem({ collectionName: 'Manager', docId: managerId }, onSuccess);
  }, []);

  useEffect(() => {
    setOtherInfoA([
      {
        k: '차량 유무',
        v: (
          <div className={styles.value}>
            <div className={styles['checkbox-wrapper']}>
              <Radiobox active={isCar} setter={setIsCar} text="있음" />
            </div>
            <div className={styles['checkbox-wrapper']}>
              <Radiobox active={isCar} setter={setIsCar} text="없음" />
            </div>
          </div>
        ),
      },
      {
        k: '입주 가능 여부',
        v: (
          <div className={styles.value}>
            <div className={styles['checkbox-wrapper']}>
              <Radiobox active={isResident} setter={setIsResident} text="가능" />
            </div>
            <div className={styles['checkbox-wrapper']}>
              <Radiobox active={isResident} setter={setIsResident} text="불가능" />
            </div>
          </div>
        ),
      },
      {
        k: 'CCTV 사용 동의',
        v: (
          <div className={styles.value}>
            <div className={styles['checkbox-wrapper']}>
              <Radiobox active={isCCTV} setter={setIsCCTV} text="동의" />
            </div>
            <div className={styles['checkbox-wrapper']}>
              <Radiobox active={isCCTV} setter={setIsCCTV} text="미동의" />
            </div>
          </div>
        ),
      },
    ]);
  }, [isCar, isResident, isCCTV]);

  const handleProfileImage = (file) => {
    if (verifyFileSize(file)) {
      setProfileImage(file);
    } else {
      return alert('1장당 2MB 이하의 이미지만 올리실 수 있습니다');
    }
  };

  return (
    <>
      <Helmet title={titleConfigs.managerUpdateTitle} />
      <div className={styles.container}>
        <Link href={`/manager/${managerId}`}>
          <a>
            <img alt="arrow" className={styles.arrow} src="/icons/arrow-left-g.png" />
          </a>
        </Link>
        {data ? (
          <>
            <div className={styles['thumbnail-section']}>
              <ThumbnailSelector file={profileImage} setter={handleProfileImage} />
            </div>
            <div className={styles.divided} />
            <div className={styles['content-label']}>기본 정보</div>
            <div className={styles['input-wrapper']}>
              <Input
                label="관리사명"
                width={180}
                value={name}
                onChange={({ target: { value } }) => setName(value)}
              />
            </div>
            <div className={styles['input-list-wrapper']}>
              <Input
                maxLength={3}
                label="연락처"
                width={78}
                value={phoneFront}
                onChange={({ target: { value } }) => setPhoneFront(onlyNumber(value))}
              />
              <div className={styles.bar}>-</div>
              <Input
                maxLength={4}
                width={78}
                value={phoneCenter}
                onChange={({ target: { value } }) => setPhoneCenter(onlyNumber(value))}
              />
              <div className={styles.bar}>-</div>
              <Input
                maxLength={4}
                width={78}
                value={phoneBack}
                onChange={({ target: { value } }) => setPhoneBack(onlyNumber(value))}
              />
            </div>
            <div className={styles['dropdown-section']}>
              <div className={styles['dropdown-wrapper-1']}>
                <div className={styles.label}>생년월일</div>
                <Dropdown
                  value={birthYear}
                  setter={setBirthYear}
                  valueSets={getYearAndMonth() ? getYearAndMonth().year : []}
                  placeholder="년"
                />
              </div>
              <div className={styles['dropdown-wrapper']}>
                <Dropdown
                  value={birthMonth}
                  setter={setBirthMonth}
                  valueSets={getYearAndMonth() ? getYearAndMonth().month : []}
                  placeholder="월"
                />
              </div>
              <div className={styles['dropdown-wrapper']}>
                <Dropdown
                  value={birthDay}
                  setter={setBirthDay}
                  valueSets={birthYear && birthMonth ? getDate(birthYear, birthMonth) : []}
                  placeholder="일"
                />
              </div>
            </div>
            <div className={styles['dropdown-section']}>
              <div className={styles['dropdown-wrapper-1']}>
                <div className={styles.label}>근무 시작일</div>
                <Dropdown
                  value={careerStartedYear}
                  setter={setCareerStartedYear}
                  valueSets={getYearAndMonth(1970) ? getYearAndMonth(1970).year : []}
                  placeholder="년"
                />
              </div>
              <div className={styles['dropdown-wrapper']}>
                <Dropdown
                  value={careerStartedMonth}
                  setter={setCareerStartedMonth}
                  valueSets={getYearAndMonth() ? getYearAndMonth().month : []}
                  placeholder="월"
                />
              </div>
              <div className={styles['dropdown-wrapper']}>
                <Dropdown
                  value={careerStartedDay}
                  setter={setCareerStartedDay}
                  valueSets={
                    careerStartedYear && careerStartedMonth
                      ? getDate(careerStartedYear, careerStartedMonth)
                      : []
                  }
                  placeholder="일"
                />
              </div>
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>파견 가능 지역</div>
            <div className={styles['dropdown-list-wrapper']}>
              <div className={styles['dropdown-wrapper-front']}>
                <Dropdown
                  value={areaFront}
                  setter={setAreaFront}
                  valueSets={Object.keys(configs.LOCATION)}
                  placeholder="시 · 도"
                />
              </div>
              <div className={styles['dropdown-wrapper-center']}>
                <Dropdown
                  value={areaCenter}
                  setter={setAreaCenter}
                  valueSets={areaFront ? Object.keys(configs.LOCATION[areaFront]) : []}
                  placeholder="군 · 구"
                />
              </div>
              <div className={styles['dropdown-wrapper-back']}>
                <Dropdown
                  value={areaBack}
                  setter={setAreaBack}
                  valueSets={areaFront && areaCenter ? configs.LOCATION[areaFront][areaCenter] : []}
                  placeholder="동 · 읍 · 면"
                />
              </div>
            </div>
            {dispatchableArea.map((area, index) => (
              <div key={String(index)} className={styles['area-wrapper']}>
                <div className={styles['dropdown-wrapper-front']}>{area.split(' ')[0]}</div>
                <div className={styles['dropdown-wrapper-center']}>{area.split(' ')[1]}</div>
                <div className={styles['dropdown-wrapper-back']}>{area.split(' ')[2]}</div>
                <div className={styles.button} onClick={handleDelete(index)}>
                  삭제
                </div>
              </div>
            ))}
            <div className={styles.divided2} />
            <div className={styles['content-label']}>기타 정보</div>
            <InfoTable data={otherInfoA} />
            <div className={styles['table-wrapper']}>
              <div className={styles['td-extend']} style={{ height: '230px' }}>
                <div className={styles['td-label']}>
                  성향
                  <br />
                  (최대 4개까지 선택)
                </div>
                <div className={styles['value-wrapper']}>
                  <div className={styles.value}>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="활발한"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="차분한"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="부지런한"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                  </div>
                  <div className={styles.value}>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="성실한"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="상냥한"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="사교적인"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                  </div>
                  <div className={styles.value}>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="선한"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="열정적인"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="꼼꼼한"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                  </div>
                  <div className={styles.value}>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="시원시원"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="손이 빠른"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="과묵한"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                  </div>
                  <div className={styles.value}>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="겸손한"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="개방적인"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <MultiRadiobox
                        limitNumber={4}
                        active={personality}
                        text="순발력 있는"
                        setter={setPersonality}
                        isArray
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles['table-wrapper']}>
              <div className={styles['td-extend']} style={{ height: '138px' }}>
                <div className={styles['td-label']}>특기</div>
                <div className={styles['value-wrapper']}>
                  <div className={styles.value}>
                    <div className={styles['checkbox-wrapper2']}>
                      <Radiobox active={specialty} setter={setSpecialty} text="정리정돈" />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <Radiobox active={specialty} setter={setSpecialty} text="가족배려" />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <Radiobox active={specialty} setter={setSpecialty} text="체형관리" />
                    </div>
                  </div>
                  <div className={styles.value}>
                    <div className={styles['checkbox-wrapper2']}>
                      <Radiobox active={specialty} setter={setSpecialty} text="음식솜씨" />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <Radiobox active={specialty} setter={setSpecialty} text="실전지식" />
                    </div>
                    <div className={styles['checkbox-wrapper2']}>
                      <Radiobox active={specialty} setter={setSpecialty} text="산모케어" />
                    </div>
                  </div>
                  <div className={styles.value}>
                    <div className={styles['checkbox-wrapper2']}>
                      <Radiobox active={specialty} setter={setSpecialty} text="신생아케어" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.divided} />
            <div className={styles['content-label']}>인증 정보</div>
            <div className={styles['cert-wrapper']}>
              <FileUploader
                id="cert-1"
                file={certName}
                onChange={({ target: { files } }) => setCertName(files[0])}
                type="실명인증"
              />
            </div>
            <div className={styles['cert-wrapper']}>
              <FileUploader
                id="cert-2"
                file={certHealth}
                onChange={({ target: { files } }) => setCertHealth(files[0])}
                type="건강인증"
              />
            </div>
            <div className={styles['cert-wrapper']}>
              <FileUploader
                id="cert-3"
                file={certCrime}
                onChange={({ target: { files } }) => setCertCrime(files[0])}
                type="범죄이력"
              />
            </div>
            <div className={styles.divided} />
            <div className={styles['button-wrapper']}>
              <LoadingButton
                onClick={handleSubmit}
                text="관리사 수정"
                buttonWidth={320}
                loading={loading}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles['thumbnail-section']}>
              <Skeleton width={180} height={180} style={{ borderRadius: '12px' }} />
            </div>
            <div className={styles.divided} />
            <div className={styles['content-label']}>기본 정보</div>
            <div className={styles['input-wrapper']}>
              <Skeleton width={180} height={46} />
            </div>
            <div className={styles['input-list-wrapper']}>
              <Skeleton width={78} height={46} />
              <div className={styles.bar}>-</div>
              <Skeleton width={78} height={46} />
              <div className={styles.bar}>-</div>
              <Skeleton width={78} height={46} />
            </div>
            <div className={styles['dropdown-section']}>
              <div className={styles['dropdown-wrapper-1']}>
                <div className={styles.label}>생년월일</div>
                <Skeleton width={102} height={46} />
              </div>
              <div className={styles['dropdown-wrapper']}>
                <Skeleton width={78} height={46} />
              </div>
              <div className={styles['dropdown-wrapper']}>
                <Skeleton width={78} height={46} />
              </div>
            </div>
            <div className={styles['dropdown-section']}>
              <div className={styles['dropdown-wrapper-1']}>
                <div className={styles.label}>생년월일</div>
                <Skeleton width={102} height={46} />
              </div>
              <div className={styles['dropdown-wrapper']}>
                <Skeleton width={78} height={46} />
              </div>
              <div className={styles['dropdown-wrapper']}>
                <Skeleton width={78} height={46} />
              </div>
            </div>
            <div className={styles.divided2} />
            <div className={styles['content-label']}>기타 정보</div>
            <div className={styles['table-wrapper']}>
              <Skeleton width={588} height={138} />
            </div>
            <div className={styles['table-wrapper']}>
              <Skeleton width={588} height={230} />
            </div>
            <div className={styles['table-wrapper']}>
              <Skeleton width={588} height={92} />
            </div>
            <div className={styles.divided} />
            <div className={styles['content-label']}>인증 정보</div>
            <div className={styles['cert-wrapper']}>
              <Skeleton width={588} height={46} style={{ marginBottom: '16px' }} />
              <div className={styles.column}>
                <Skeleton width={240} height={15} style={{ marginBottom: '6px' }} />
                <Skeleton width={291} height={15} />
              </div>
            </div>
            <div className={styles['cert-wrapper']}>
              <Skeleton width={588} height={46} style={{ marginBottom: '16px' }} />
              <div className={styles.column}>
                <Skeleton width={240} height={15} style={{ marginBottom: '6px' }} />
                <Skeleton width={291} height={15} />
              </div>
            </div>
            <div className={styles['cert-wrapper']}>
              <Skeleton width={588} height={46} style={{ marginBottom: '16px' }} />
              <div className={styles.column}>
                <Skeleton width={240} height={15} style={{ marginBottom: '6px' }} />
                <Skeleton width={291} height={15} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ManagerUpdatePage;
