class News {
  static id = 1;

  constructor(title, body) {
    this.id = News.id;
    News.id += 1;
    this.title = title;
    this.body = body;
  }
}

export default News;
