import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/database';

function handler(req: NextApiRequest, res: NextApiResponse ){

   switch (req.method) {
      case 'GET':
         return getUsers()

      default:
         return res.status(400).send('No method provider')
    }

    async function getUsers(){

        const { id }: any = req.query

        const user = await prisma.users.findUnique({ 
            select: {
                groups: {
                    select: {
                        group: true
                    },
                    where: {
                        group: {
                            modules: {
                                name: {
                                    in: [`${process.env.MODULE}`]
                                }
                            }
                        }
                    }
                }, 
                login: true, 
                name: true
            }, 
            where: { 
                id: parseInt(id)
            }
        })        

        return res.status(200).send(user)
    }

  }

export default handler