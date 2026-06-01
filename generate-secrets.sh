openssl genpkey -algorithm ed25519 -out private_key.pem
openssl pkey -in private_key.pem -pubout -out public_key.pem

base64 private_key.pem -w 0 > private_key.b64
base64 public_key.pem -w 0 > public_key.b64

private_key=$(sed -n 1p private_key.b64)
public_key=$(sed -n 1p public_key.b64)
cookie_secret=$(openssl rand -hex 32)

sed -i "" "s/^AUTH_JWT_PRIVATE_KEY=.*/AUTH_JWT_PRIVATE_KEY=$private_key/" ./.env
sed -i "" "s/^AUTH_JWT_PUBLIC_KEY=.*/AUTH_JWT_PUBLIC_KEY=$public_key/" ./.env
sed -i "" "s/^COOKIE_SECRET=.*/COOKIE_SECRET=$cookie_secret/" ./.env

rm private_key.pem
rm public_key.pem
rm private_key.b64
rm public_key.b64