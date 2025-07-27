## 安装k3s

安装k3s

```sh
curl -sfL https://get.k3s.io | sh -
```

换源

```sh
cat << EOF > /etc/rancher/k3s/registries.yaml
mirrors:
  docker.io:
    endpoint:
   - "https://docker.m.daocloud.io"
EOF
```

重启

```sh
systemctl restart k3s
```

## 编译前端

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm alias default node
node -v
npm config set registry http://registry.npmmirror.com
```

分别编译 `website/web` 和 `website/webmaster`


## 编译后端
```sh
export RUSTUP_DIST_SERVER="https://mirrors.tuna.tsinghua.edu.cn/rustup"
export RUSTUP_UPDATE_ROOT="https://mirrors.tuna.tsinghua.edu.cn/rustup/rustup"
apt install musl-tools
apt install rustup
rustup default stable
rustup target add x86_64-unknown-linux-musl
cargo build --release --target x86_64-unknown-linux-musl
```

阅读 `website/server/README.md` 添加 `.env` 文件

## 项目启动

kubectl安装证书

```sh
kubectl create secret tls website-tls-secret \
  --cert=./fullchain.crt \
  --key=./private.pem
```

启动

```sh
kubectl apply -f deployment.yaml
```

> 数据备份
>
> ```sh
> kubectl exec -it $(kubectl get pod -l app=postgres -o jsonpath="{.items[0].metadata.name}") -- pg_dump -U postgres -d website --data-only > backup_$(date +%Y%m%d_%H%M%S).sql
> ```
>
> 数据恢复
>
> ```sh
> kubectl exec -i $(kubectl get pod -l app=postgres -o jsonpath="{.items[0].metadata.name}") -- psql -U postgres -d website < backup_20250713_194232.sql
> ```

