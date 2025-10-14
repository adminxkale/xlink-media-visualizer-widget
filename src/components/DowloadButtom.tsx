import { Button } from "antd";
import { DownloadOutlined }from '@ant-design/icons';

interface dowloadButtomProps {
url: string;
}

const DownloadButton: React.FC<dowloadButtomProps>= ({url}) => {
const handleDownload = async () => {
  try {
    const proxyUrl = `api/proxy-download/?url=${encodeURIComponent(url)}`;
    const link = document.createElement("a");
    link.href = proxyUrl;
    link.download = url.split("/").pop() || "archivo";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error al descargar:", error);
  }
};
  return (
    <Button onClick={handleDownload}><DownloadOutlined /></Button>
  );
};

export default DownloadButton
