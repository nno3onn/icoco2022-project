/* eslint-disable operator-linebreak */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Dropdown from 'components/dropdown';
import Helmet from 'components/helmet';
import Input from 'components/input';
import ThumbnailSelector from 'components/thumbnailSelector';
import Radiobox from 'components/radiobox';
import MultiRadiobox from 'components/radiobox/multi';
import FileUploader from 'components/table/fileUploader';
import LoadingButton from 'components/button/loading';

import configs from 'configs/data';
import titleConfigs from 'configs/title';

import getDate from 'utils/time/getDate';
import getYearAndMonth from 'utils/time/getYearAndMonth';
import onlyNumber from 'utils/input/onlyNumber';
import createManager from 'utils/manager/create';
import verifyFileSize from 'utils/input/verifyFileSize';

import styles from './index.module.scss';

const ManagerCreatePage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('');
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
  const [specialty, setSpecialty] = useState('정리정돈');
  const [certName, setCertName] = useState();
  const [certHealth, setCertHealth] = useState();
  const [certCrime, setCertCrime] = useState();

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
      !careerStartedDay ||
      !specialty
    ) {
      return alert('모든 항목을 채워주세요');
    }

    if (window.confirm('추가하시겠습니까?')) {
      setLoading(true);

      const managerInfo = {
        profileImage,
        name,
        dispatchableArea,
        birthDate: `${birthYear}.${birthMonth}.${birthDay}`,
        phone: `${phoneFront}-${phoneCenter}-${phoneBack}`,
        careerStartedDate: `${careerStartedYear}.${careerStartedMonth}.${careerStartedDay}`,
        isCar,
        isResident,
        isCCTV,
        personality,
        certName,
        certHealth,
        certCrime,
        specialty,
      };

      const onSuccess = (managerId) => {
        alert('관리사를 생성하였습니다.');
        router.push(`/manager/${managerId}`);
      };

      createManager(managerInfo, onSuccess);
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

  const handleProfileImage = (file) => {
    if (verifyFileSize(file)) {
      setProfileImage(file);
    } else {
      return alert('1장당 2MB 이하의 이미지만 올리실 수 있습니다');
    }
  };

  return (
    <>
      <Helmet title={titleConfigs.managerCreateTitle} />
      <div className={styles.container}>
        <div className={styles.heading}>관리사 추가</div>
        <div className={styles['profileImage-section']}>
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
        <div className={styles.label}>
          파견 가능 지역
          <span> (다중 선택 가능)</span>
        </div>
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
            <button type="button" className={styles.button} onClick={handleDelete(index)}>
              삭제
            </button>
          </div>
        ))}
        <div className={styles.divided2} />
        <div className={styles['content-label']}>기타 정보</div>
        <div className={styles['table-wrapper']}>
          <div className={styles['td-top']}>
            <div className={styles['td-label']}>차량 유무</div>
            <div className={styles.value}>
              <div className={styles['checkbox-wrapper']}>
                <Radiobox active={isCar} setter={setIsCar} text="있음" />
              </div>
              <div className={styles['checkbox-wrapper']}>
                <Radiobox active={isCar} setter={setIsCar} text="없음" />
              </div>
            </div>
          </div>
          <div className={styles.td}>
            <div className={styles['td-label']}>입주 가능 여부</div>
            <div className={styles.value}>
              <div className={styles['checkbox-wrapper']}>
                <Radiobox active={isResident} setter={setIsResident} text="가능" />
              </div>
              <div className={styles['checkbox-wrapper']}>
                <Radiobox active={isResident} setter={setIsResident} text="불가능" />
              </div>
            </div>
          </div>
          <div className={styles.td}>
            <div className={styles['td-label']}>CCTV 사용 동의</div>
            <div className={styles.value}>
              <div className={styles['checkbox-wrapper']}>
                <Radiobox active={isCCTV} setter={setIsCCTV} text="동의" />
              </div>
              <div className={styles['checkbox-wrapper']}>
                <Radiobox active={isCCTV} setter={setIsCCTV} text="미동의" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles['table-wrapper']}>
          <div className={styles['td-extend']} style={{ height: '230px' }}>
            <div className={styles['td-label']}>
              성향
              <br />
              (최대 4개까지 선택)
            </div>
            <div className={styles['value-wrapper']}>
              <div className={styles.value}>
                <div className={styles['checkbox-wrapper']}>
                  <MultiRadiobox
                    limitNumber={4}
                    active={personality}
                    text="활발한"
                    setter={setPersonality}
                    isArray
                  />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <MultiRadiobox
                    limitNumber={4}
                    active={personality}
                    text="차분한"
                    setter={setPersonality}
                    isArray
                  />
                </div>
                <div className={styles['checkbox-wrapper']}>
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
                <div className={styles['checkbox-wrapper']}>
                  <MultiRadiobox
                    limitNumber={4}
                    active={personality}
                    text="성실한"
                    setter={setPersonality}
                    isArray
                  />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <MultiRadiobox
                    limitNumber={4}
                    active={personality}
                    text="상냥한"
                    setter={setPersonality}
                    isArray
                  />
                </div>
                <div className={styles['checkbox-wrapper']}>
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
                <div className={styles['checkbox-wrapper']}>
                  <MultiRadiobox
                    limitNumber={4}
                    active={personality}
                    text="선한"
                    setter={setPersonality}
                    isArray
                  />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <MultiRadiobox
                    limitNumber={4}
                    active={personality}
                    text="열정적인"
                    setter={setPersonality}
                    isArray
                  />
                </div>
                <div className={styles['checkbox-wrapper']}>
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
                <div className={styles['checkbox-wrapper']}>
                  <MultiRadiobox
                    limitNumber={4}
                    active={personality}
                    text="시원시원"
                    setter={setPersonality}
                    isArray
                  />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <MultiRadiobox
                    limitNumber={4}
                    active={personality}
                    text="손이 빠른"
                    setter={setPersonality}
                    isArray
                  />
                </div>
                <div className={styles['checkbox-wrapper']}>
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
                <div className={styles['checkbox-wrapper']}>
                  <MultiRadiobox
                    limitNumber={4}
                    active={personality}
                    text="겸손한"
                    setter={setPersonality}
                    isArray
                  />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <MultiRadiobox
                    limitNumber={4}
                    active={personality}
                    text="개방적인"
                    setter={setPersonality}
                    isArray
                  />
                </div>
                <div className={styles['checkbox-wrapper']}>
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
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox active={specialty} setter={setSpecialty} text="정리정돈" />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox active={specialty} setter={setSpecialty} text="가족배려" />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox active={specialty} setter={setSpecialty} text="체형관리" />
                </div>
              </div>
              <div className={styles.value}>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox active={specialty} setter={setSpecialty} text="음식솜씨" />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox active={specialty} setter={setSpecialty} text="실전지식" />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <Radiobox active={specialty} setter={setSpecialty} text="산모케어" />
                </div>
              </div>
              <div className={styles.value}>
                <div className={styles['checkbox-wrapper']}>
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
            text="관리사 등록"
            buttonWidth={180}
            buttonHeight={46}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default ManagerCreatePage;
