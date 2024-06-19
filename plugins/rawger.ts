import Rawger from 'rawger';

export default ({ app }, inject) => {
  const apiKey = 'f31a286fc5484379a9bafb44ea69fee0'; // Replace with your RAWG API key
  const rawger = new Rawger(apiKey);

  // Inject the rawger instance into the context as $rawger
  inject('rawger', rawger);
};
