#!/usr/bin/env python3
import requests
import json
import sys
from collections import OrderedDict


def usage():
    file_name = sys.argv[0]
    print("python %s 状态 分支 项目 git信息" % file_name)

def feishu_notify(card_body):
    url = "http://101.200.210.72:8010/api/send-msg"
    data = {
        "token": "t-2eb9d3549b46e19dacbaa3ea92c88ff0",
        "from_user": "任务发布系统",
        "to_group": "DVDFab官网测试群",
        "msg_type": "interactive",
        "card_title": "www.dvdfab.cn发布通知",
        "card_type": "normal_card",
        "card_body": card_body
    }
    requests.post(url, json.dumps(data))

try:
    status = sys.argv[1]
    branch = sys.argv[2]
    project = sys.argv[3]
    git_log = sys.argv[4]
    card_body = OrderedDict([
        ("发布工程", project),
        ("发布分支", branch),
        ("发布状态", status),
        ("更新内容", git_log)
    ])
    feishu_notify(card_body)
except Exception as e:
    print(e)
    usage()
    exit(5)