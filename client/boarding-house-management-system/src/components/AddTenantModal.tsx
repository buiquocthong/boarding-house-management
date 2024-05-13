import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { PlusIcon } from './icon/PlusIcon';
import { useMemo, useState } from 'react';
import CustomSelect, { ISelectItem } from './CustomSelect';
import ServiceRow from './ServiceRow';
import Image from 'next/image';
import { parseOnlyNumber } from '@/utils/converterUtil';
import { IRoom, ITenant } from '@/utils/types';
import { useAddRoomMutation } from '@/libs/services/roomApi';
import { parseDate } from '@internationalized/date';
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
} from '@/libs/services/locationApi';
import { useAddTenantMutation } from '@/libs/services/tenantApi';

const AddTenantModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [addTenantTrigger] = useAddTenantMutation();
  //
  const [fullName, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [gender, setGender] = useState(new Set([]));
  const [birthday, setBirthday] = useState(parseDate('1970-01-01'));
  const [career, setCareer] = useState('');
  // Address
  const {
    data: provincesData,
    isLoading: isProvincesLoading,
    error: provincesError,
  } = useGetProvincesQuery();
  const [province, setProvince] = useState(new Set([]));
  //
  const {
    data: districtsData,
    error: districtsError,
    isLoading: districtsLoading,
    // @ts-ignore
  } = useGetDistrictsQuery(Array.from(province).at(0));
  const [district, setDistrict] = useState(new Set([]));
  const {
    data: wardsData,
    error: wardsError,
    isLoading: wardsLoading,
    // @ts-ignore
  } = useGetWardsQuery(Array.from(district).at(0));
  const [ward, setWard] = useState(new Set([]));

  const [addressDetails, setAddressDetails] = useState('');
  //
  // @ts-ignore
  const provinces: ISelectItem[] = useMemo(() => {
    return provincesData?.results.map((i) => ({
      id: i.province_id,
      value: i.province_name.replace('Thành phố', '').replace('Tỉnh', ''),
    }));
  }, [provincesData]);

  // @ts-ignore
  const districts: ISelectItem[] = useMemo(() => {
    return districtsData?.results.map((i) => ({
      id: i.district_id,
      value: i.district_name.replace(i.district_type, ''),
    }));
  }, [districtsData]);

  // @ts-ignore
  const wards: ISelectItem[] = useMemo(() => {
    return wardsData?.results.map((i) => ({
      id: i.ward_id,
      value: i.ward_name.replace(i.ward_type, ''),
    }));
  }, [wardsData]);

  const GENDER = useMemo(() => ['MALE', 'FEMALE', 'UNKNOWN'], []);

  const handleAddTenant = async () => {
    // validate input

    //
    // @ts-ignore
    const newTennt: ITenant = {
      id: 0,
      fullName,
      email,
      phoneNumber,
      idCardNumber,
      // @ts-ignore
      gender: Array.from(gender).at(0),
      address: {
        // @ts-ignore
        city: Array.from(province).at(0),
        // @ts-ignore
        district: Array.from(district).at(0),
        // @ts-ignore
        ward: Array.from(ward).at(0),
        // @ts-ignore
        street: Array.from(addressDetails).at(0),
      },
      birthday: birthday.toString(),
      career,
      rooms: [], //
    };
    //
    try {
      // const response = await addTenantTrigger(newTennt).unwrap();
      console.log('Added tenant: ' + JSON.stringify(newTennt));
    } catch (err: any) {
      console.log('Failed to add tenant: ' + err.message);
    }
  };

  if (isProvincesLoading || districtsLoading || wardsLoading) {
    return <div>is loading...</div>;
  }
  if (provincesError || districtsError || wardsError) {
    return <div>error</div>;
  }

  return (
    <>
      <Button
        onPress={onOpen}
        variant="solid"
        size="sm"
        className="focus:outline-none rounded-full bg-primary w-6 h-12 flex items-center justify-center"
      >
        <PlusIcon className="text-white" />
      </Button>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={false}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: 'easeOut',
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: 'easeIn',
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex justify-center items-center w-full text-center">
                  <Image
                    alt=""
                    src={'/image/room/add.png'}
                    sizes="100"
                    width={40}
                    height={40}
                  />
                  <h2 className="text-2xl ml-2">
                    Add tenant information for the room
                  </h2>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-5">
                  {/* Room info */}
                  <div className="col-span-3">
                    <div className="border-s-4 border-[#4b4ce4] ps-2">
                      <h2 className="text-xl font-semibold">Room List</h2>
                      <p className="italic text-xs text-gray-500">
                        List of rooms to add tenants
                      </p>
                    </div>
                  </div>
                  {/* Tenant info */}
                  <div className="space-y-4 col-span-2">
                    {/* Header */}
                    <div className="border-s-4 border-[#4b4ce4] ps-2">
                      <h2 className="text-xl font-semibold">
                        Personal information of tenants:
                      </h2>
                      <p className="italic text-xs text-gray-500">
                        Tenant and deposit information
                      </p>
                    </div>
                    {/* Required infor */}
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        size="sm"
                        isRequired
                        isClearable
                        label="Tenant name"
                        value={fullName}
                        onValueChange={setFullname}
                      />
                      <Input
                        size="sm"
                        isRequired
                        isClearable
                        label="Phone number"
                        value={phoneNumber}
                        onValueChange={setPhoneNumber}
                      />
                      <Input
                        size="sm"
                        className="col-span-2"
                        isRequired
                        isClearable
                        label="Email"
                        value={email}
                        onValueChange={setEmail}
                      />
                      <Input
                        size="sm"
                        className="col-span-2"
                        isRequired
                        isClearable
                        label="ID card number"
                        value={idCardNumber}
                        onValueChange={setIdCardNumber}
                      />
                      <CustomSelect
                        size="sm"
                        isRequired={true}
                        label="Select gender"
                        items={GENDER}
                        selectedKey={gender}
                        onSelectionChange={setGender}
                      />
                      <DatePicker
                        size="sm"
                        label={'Birthday'}
                        value={birthday}
                        onChange={setBirthday}
                        showMonthAndYearPickers
                      />
                      {/* Address */}
                      {isProvincesLoading ? (
                        <p>Loading Provinces...</p>
                      ) : provincesError ? (
                        <p>Provinces error</p>
                      ) : (
                        <CustomSelect
                          size="md"
                          isRequired={true}
                          label="Select Province/City"
                          items={provinces}
                          selectedKey={province}
                          onSelectionChange={(e) => {
                            setProvince(e);
                            setDistrict(new Set([]));
                          }}
                        />
                      )}
                      {districtsLoading ? (
                        <p>Loading districts...</p>
                      ) : districtsError ? (
                        <p>Districts error</p>
                      ) : (
                        <CustomSelect
                          size="md"
                          isRequired={true}
                          label="Select District"
                          items={districts}
                          selectedKey={district}
                          onSelectionChange={setDistrict}
                        />
                      )}
                      {wardsLoading ? (
                        <p>Loading Wards...</p>
                      ) : wardsError ? (
                        <p>Wards error</p>
                      ) : (
                        <CustomSelect
                          className="col-span-2 focus:outline-none"
                          size="md"
                          isRequired={true}
                          label="Select Ward/Commune"
                          items={wards}
                          selectedKey={ward}
                          onSelectionChange={setWard}
                        />
                      )}
                      <Input
                        size="md"
                        className="col-span-2"
                        isRequired
                        isClearable
                        label="Address details. Ex: 122 - Nguyen Duy Trinh Street"
                        value={addressDetails}
                        onValueChange={setAddressDetails}
                      />
                    </div>
                    <Input
                      size="sm"
                      className="col-span-2"
                      isRequired
                      isClearable
                      label="Career"
                      value={career}
                      onValueChange={setCareer}
                    />
                  </div>
                </div>
                <ModalFooter className="space-x-6">
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      handleAddTenant();
                      onClose();
                    }}
                  >
                    Add
                  </Button>
                </ModalFooter>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddTenantModal;