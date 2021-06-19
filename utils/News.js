class News {
  static id = 1;

  constructor(title, body, authorId) {
    this.id = News.id;
    News.id += 1;
    this.title = title;
    this.body = body;
    this.authorId = authorId;
  }
}

export default News;
