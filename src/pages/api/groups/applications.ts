import { NextApiRequest, NextApiResponse } from 'next';
import { withRules } from '../../../middleware/withRules';
import { prisma } from '../../../utils/database';

function handler(req: NextApiRequest, res: NextApiResponse ){

   switch (req.method) {
      case 'GET':
         return getAllApplications()

      default:
         return res.status(400).send('No method provider')
    }

    async function getAllApplications(){
        const applications = await prisma.applications.findMany()

        return res.status(200).send(applications)
    }

  }

export default withRules(handler) 