
class CoreController {
  RADIX_PARSEINT= 10;
  datamapper = null;

  index = async (req, res) => {
    const endpointsArray = req.path.split('/').slice(1);
    
    // TODO : The core datamapper
    // const data = await this.datamapper.getAll(endpointsArray);

    res.status(200).json({data: 
      [
        {
          id: 13,
          title: 'parc bleu', 
          url: 'parc-bleu',
          description: 'il s’agit du parc bleu blabla',
          avg_rate: 4.8,
          image: 'https://image.com',
          address: 'rue du JS ',
          phone: '0785475126',
          longitude: 4.25154789,
          latitude: 45.14789315,
          city_id: 78
        },
        {
          id: 27,
          title: 'resto du coin bleu', 
          url: 'resto-du-coin-bleu',
          description: 'il s’agit du resto du coin blablabla',
          avg_rate: 2.8,
          image: 'https://image2.com',
          address: 'rue du chocolat ',
          phone: '0784579685',
          longitude: 7.25154789,
          latitude: 52.14789315,
          city_id: 78
        },
      ]
    });
  }

  store = async (req, res) => {
    const requestData = req.body;
    console.log(requestData);

    // TODO : The core datamapper
    // const data = await this.datamapper.create(requestData);

    res.status(201).json({data: 
      [
        {
          id: 13,
          title: 'parc bleu', 
          url: 'parc-bleu',
          description: 'il s’agit du parc bleu blabla',
          avg_rate: 4.8,
          image: 'https://image.com',
          address: 'rue du JS ',
          phone: '0785475126',
          longitude: 4.25154789,
          latitude: 45.14789315,
          city_id: 78
        },
      ]
    });

  }

  destroy = async (req, res) => {
    const id = Number.parseInt(req.params.id, this.RADIX_PARSEINT);

    // TODO : The core datamapper
    // const findedData = await this.datamapper.getOne(id);
    const findedData = 1;
    console.log(findedData);

    if(findedData.length === 0) {
      throw new Error('Bad request. The provided id don\'t exist', {status: 404});
    }

    // TODO : The core datamapper
    // const data = await this.datamapper.delete(id);

    res.status(204).json({});
  }

  update = async (req, res, next) => {
    const requestData = req.body;
    const id = Number.parseInt(req.params.id, this.RADIX_PARSEINT);

    // TODO : The core datamapper
    // const data = await this.datamapper.getOne(id);
    const data = 1;

    if(data.length === 0) {
      throw new Error('Bad request. The provided id don\'t exist', {status: 404});
    }

    // TODO : The core datamapper
    // const updatedData = await this.datamapper.update(id, requestData);

    res.status(200).json({data: 
      [
        {
          id: id,
          title: 'modifié', 
          url: 'modifié',
          description: 'il s’agit du modifié',
          avg_rate: 4.8,
          image: 'https://modifié.com',
          address: 'rue du modifié ',
          phone: '0785475126',
          longitude: 4.25154789,
          latitude: 45.14789315,
          city_id: 78
        }
      ]
    });
  }


}

export default CoreController;