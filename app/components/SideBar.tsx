import {
  Listbox,
  ListboxItem
} from "@heroui/listbox";
import { Button, Checkbox, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, User, useDisclosure } from "@heroui/react";
import { useLocation, useNavigate, useSubmit } from "@remix-run/react";
import { Bookmark, BookmarkBook, Clock, Git, Home, QuestionMark, SendMail, Settings } from "iconoir-react";
import { useEffect, useState } from "react";
import config from '../services/servicesConfig.json';


const ListBoxItems = [
  {
    key:"dashboard",
    content:"工作台",
    icon:<Home/>
  },
  {
    key:"history",
    content:"历史",
    icon:<Clock/>
  }, 
  {
    key:"repository",
    content:"知识库",
    icon:<BookmarkBook/>
  }, 
  {
    key:"about",
    content:"关于",
    icon:<Git/>
  },
  {
    key:"1",
    content:"产品说明",
    icon:<QuestionMark/>,
  }, 
  {
    key:"report",
    content:"问题反馈",
    icon:<SendMail/>
  },
  {
    key:"favorite",
    content:"收藏",
    icon:<Bookmark/>,
    description:"开发中，敬请期待"
  }
]

export default function SideBar({username = "", userId = 0}: {username:string, userId:number}) {
  const navigate = useNavigate();
  const location = useLocation();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const historyModal = useDisclosure();
  const isHistoryModalOpen = historyModal.isOpen;
  const onHistoryModalOpen= historyModal.onOpen;
  const onHistoryModalClose = historyModal.onClose;
  const [isDismiss, setIsDismiss] = useState(false);
  const submit = useSubmit();

  useEffect(() => {
    if (location.pathname === "/dashboard" && !isDismiss){
        onOpen();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <div className="w-full max-w-[240px] h-full border-neutral-300 border-r-2">
      <Modal backdrop="blur" size="xl" isOpen={isOpen} onClose={onClose} isDismissable={isDismiss}>
        <ModalContent>
          {(onClose:any) => (
            <>
              <ModalHeader className="text-slate-600">
                <span className="m-auto text-2xl">产品说明</span>
              </ModalHeader>
              <ModalBody className="pt-0">
                <p>1.SubAI是基于deepseek V2大语言模型制作的专供北大附中同学使用的AI互动模型，本产品所有互动会话均为AI自动生成，其内容具有一定不可预测性。生成内容仅供参考，不代表北大附中及SubIT任何成员的观点及立场。</p>
                <p>2.SubAI的账户注册和登录基于SSubITO登录系统，请在登录系统中注册并基于此账号使用。</p>
                <p>3.SubAI由SubIT社团成员独立制作和出品，SubIT对本产品及相关条例具有最终解释权。</p>
              </ModalBody>
              <ModalFooter className="flex gap-12 justify-center">
                <Button color="primary" onPress={ () => { onClose(); if (isDismiss) submit({
                  intent: "dismiss",
                  username: username,
                  userId: userId
                }, {
                  method: "POST",
                  action: "/dashboard"
                }); } }>
                  我已知悉，启动！
                </Button>
                <Button variant="light" onPress={ () => { navigate("/about") } }>
                  不接受捏，退出！
                </Button>
                <Checkbox isSelected={isDismiss} onValueChange={setIsDismiss}>不再提醒</Checkbox>{/* TODO? */}
              </ModalFooter>
            </>)}
        </ModalContent>
      </Modal>

      {/* <Modal backdrop="opaque" size="xl" isOpen={isHistoryModalOpen} onClose={onHistoryModalClose} >
        <ModalContent>
        {(onHistoryModalClose) => (
            <>
              <ModalHeader className="text-slate-600">
                <span className="m-auto text-2xl">产品说明</span>
              </ModalHeader>
              <ModalBody className="pt-0">
                历史
              </ModalBody>
              <ModalFooter className="flex gap-12 justify-center">
                <Button color="primary" onPress={ () => { onHistoryModalClose(); if (isDismiss) submit({
                  intent: "dismiss",
                  username: username,
                  userId: userId
                }, {
                  method: "POST",
                  action: "/dashboard"
                }); } }>
                  启动！
                </Button>
              </ModalFooter>
            </>)}
        </ModalContent>
      </Modal> */}

      <div className="w-full flex justify-center pt-4">
        <Link href={location.pathname}>{/*https://subit.org.cn/ */}
          <Image className="flex" width={150} src="/SubIT-Normal.svg"/>
        </Link>
      </div>
      {/*ListboxWrapper*/}
      <div className="w-full px-1 py-4 flex flex-col">{/*border-default-200 dark:border-default-100 border-small */}
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <div className="flex flex-row ml-4 mb-4">
              <User as="button" avatarProps={{ isBordered: true, src: userId === 0 ? "" : config.ssoRedirectServerUrl + "/avatar/" + userId.toString() }}
                name={username === "" ? "未登录" : username} className="transition-transform"
              />
            </div>
          </DropdownTrigger>
          <DropdownMenu variant="flat">
            <DropdownItem key="settings" className="h-fit gap-2" as={Link} href={config.ssoUrl + `/sso?from=${config.domain.startsWith("http") ? config.domain : "http://" + config.domain}`} startContent={<Settings/>}>
              {username === "" ? "登录" : "个人设置"}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Listbox aria-label="Actions" disabledKeys={["favorite"]}
          onAction={(key) => { 
            if(key == "1"){ onOpen(); }
            else if(key == "history"){ onHistoryModalOpen(); }
            else{ navigate('/'+key); } 
          }}>
          { ListBoxItems.map((item) => (
            <ListboxItem className="h-11" key={item.key} startContent={item.icon} description={item.description}>
              {item.content}
            </ListboxItem>
          ))}
        </Listbox>
      </div>
    </div>
  );
}