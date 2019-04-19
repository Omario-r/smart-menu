import { message } from 'antd';

const error = (msg, duration = 10) => {
  message.error(msg || 'Some error happens =(', duration);
};

const success = (msg, duration = 5) => {
  message.success(msg || 'Ok', duration);
};

export default {
  error, success,
}
