import {DataSource} from 'apollo-datasource'
import {UserInputError} from 'apollo-server'

import Pagination from '../../../lib/Pagination"

class ContentDataSource extends DataSource {
  constructor({Post, Profile, Reply}) {
    super()
    this.Post = Post
    this.Profile = Profile
    this.Reply = Reply
    this.postPagination = new Pagination(Post)
    this.replyPagination = new Pagination(Reply)
  }

  _getContentSort(sortEnum){
    let sort = {}

    if(sortEnum) {
      const sortArgs = sortEnum.split("_")
      const [field, direction] = sortArgs
      sort[field] = direction === "DESC" ? -1 : 1
    } else {
      sort.createdAt = -1
    }

    return sort
  }

  getPostById(id) {
    return this.Post.findById(id)
  }

  async getOwnPosts({
    after,
    before,
    first,
    last,
    orderBy,
    authorProfileId
  }) {
    const sort = this._getContentSort(orderBy)
    const filter = { authorProfileId}
    const queryArgs = {after, before, first,last, filter, sort}
    const edges = await this.postPagination.getEdges(queryArgs)
    const pageInfo = await this.postPagination.getPageInfo(
      edges,
      queryArgs
    )
    return {edges, pageInfo}

  }

  async getPosts({
    after,
    before,
    first,
    last,
    orderBy,
    filter: rawFilter
  }) {
    let filter = {}

    const sort = this._getContentSort(orderBy)
    const queryArgs = {after, before, first,last, filter, sort}
    const edges = await this.postPagination.getEdges(queryArgs)
    const pageInfo = await this.postPagination.getPageInfo(
      edges,
      queryArgs
    )

    return {edges, pageInfo}
  }
}

export default ContentDataSource