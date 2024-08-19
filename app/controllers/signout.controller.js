const signoutController = {
  async index(req, res) {
    try {
      // On commence par détruire la session sur le serveur
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session ', err.message);
          return res
            .status(500)
            .json({ error: 'An error occurred while logging out' });
        }
        // Et ici on supprime le cookie de session stocké sur le nav du client, celui-ci se nomme par défaut connect.sid
        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).json({ message: 'logged out successfully' });
      });
    } catch (error) {
      console.error('Error in cityController: index method', error.message);
      res.status(500).json({ error: 'An error occurred' });
    }
  },
};

export default signoutController;
