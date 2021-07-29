import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import crypto from 'crypto'

aws.config.update({
    secretAccessKey: process.env.AWS_SECRETKEY,
    accessKeyId: process.env.AWS_ACCESSKEY,
    region: process.env.AWSREGION,
})

const s3 = new aws.S3({})

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWSBUCKET || '',
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        crypto.randomBytes( 16, (err, hash) => {
            if(err) cb(err)
            const filename = `${hash.toString('hex')}-${file.originalname}` 
            cb(null, filename)
            
        })
    }
    })
  })

 
export default upload
