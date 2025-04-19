import { genAuthCaptcha } from '@/apis';
import { Button, Image, Space } from 'antd';
import React from 'react';
import Token from '@/apis/request/token';

interface CaptchaProps {
  disabled?: boolean;
}

const Captcha: React.FC<CaptchaProps> = ({ disabled }) => {
  const [svgString, setSvgString] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  function refreshCaptcha() {
  
    setLoading(true);
    genAuthCaptcha()
      .then((res) => {
        console.log(res);
        setSvgString(btoa(res.data.svg));
        Token.set(res.data.token);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Space size={8}>
      <Button
        size="large"
        disabled={disabled}
        onClick={refreshCaptcha}
        loading={loading}>
        获取
      </Button>
      {svgString && (
        <Image
          width={120}
          src={`data:image/svg+xml;base64,${svgString}`}
          fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSI1MCIgZmlsbD0iI0FBQUFBQSIgc3R5bGU9ImZvbnQtc2l6ZToxMHB4OyIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj5Mb2FkaW5nPC90ZXh0Pjwvc3ZnPg=="
        />
      )}
    </Space>
  );
};

export default Captcha;
