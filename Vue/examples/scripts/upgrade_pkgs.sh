#!/bin/bash
set -ex

ncu -u
 
(cd ./packages/lego-form-core && ncu -u)
(cd ./packages/lego-form-antd && ncu -u)
(cd ./packages/lego-form-builder && ncu -u)

