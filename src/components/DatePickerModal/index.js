import React from 'react';
import {View} from 'react-native';

import DatePicker from 'react-native-date-picker';

function DatePickerModal({
  setOpen,
  open,
  currentDate,
  setCurrentDate,
  modal,
  setSelected,
  mode,
  minuteInterval,
  handleSubmit,
  ...props
}) {
  return (
    // <View>
    <DatePicker
      modal={modal}
      mode={mode}
      open={open}
      androidVariant={'iosClone'}
      date={currentDate}
      onConfirm={date => {
        setOpen(false);
        setCurrentDate(date);
        setSelected ? setSelected(true) : null;
      }}
      minuteInterval={minuteInterval ? minuteInterval : 1}
      onCancel={() => {
        setOpen(false);
      }}
      // onDateChange={date => {
      //   setCurrentDate(date)
      // }}
      {...props}
    />
    // </View>
  );
}

export default DatePickerModal;
