import { Modal } from "antd";

export interface ConfirmActionOptions {
  title: string;
  content: string;
  okText: string;
  cancelText: string;
  onOk: () => void | Promise<void>;
  danger?: boolean;
}

export function confirmAction({
  title,
  content,
  okText,
  cancelText,
  onOk,
  danger = true,
}: ConfirmActionOptions) {
  return Modal.confirm({
    title,
    content,
    okText,
    cancelText,
    okButtonProps: { danger },
    centered: true,
    onOk,
  });
}
