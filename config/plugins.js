module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "s3-cloudfront",
      providerOptions: {
        accessKeyId: env("ACCESS_KEY_ID"),
        secretAccessKey: env("ACCESS_KEY_SECRET"),
        region: env("AWS_REGION"),
        params: {
          Bucket: env("BUCKET_NAME"),
        },
        cdn: env("CDN_DOMAIN"), // https://d1sup9poj2dr2a.cloudfront.net
      },
    },
  },
  'ai-filler': {
    enabled: true,
    resolve: './src/plugins/ai-filler'
  },
});
