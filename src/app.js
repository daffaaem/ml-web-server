const Hapi = require('@hapi/hapi');
const { loadModel, predict } = require('./inference');

(async () => {
    const model = await loadModel();
    console.log('modul loaded!');
    const server = Hapi.server({
        host: process.env.NODE_ENV !== 'production' ? 'localhost': '0.0.0.0/0',
        port: 3000
    });

    server.route({
        method: 'POST',
        path: '/predicts',
        handler: async (request) => {
            const { image } = request.payload;
            const predictions = await predict (model, image);
            const [paper, rock] = predictions;

            if(paper) {
                return {result: 'paper'};
            }
            
            if(rock) {
                return {result: 'rock'};
            }

            return {result: 'scissors'};
        },

        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
            }
        }
    });

    await server.start();
    console.log(`Server is running at: ${server.info.uri}`);
})();