import * as React from 'react'
import moment from 'moment'

import { IMatches } from '../../lib/fuzzy-find'

import { Octicon, OcticonSymbol } from '../octicons'
import { HighlightText } from '../lib/highlight-text'
import { showContextualMenu } from '../main-process-proxy'
import { IMenuItem } from '../../lib/menu-item'

interface IBranchListItemProps {
  /** The name of the branch */
  readonly name: string

  /** Specifies whether this item is currently selected */
  readonly isCurrentBranch: boolean

  /** The date may be null if we haven't loaded the tip commit yet. */
  readonly lastCommitDate: Date | null

  /** The characters in the branch name to highlight */
  readonly matches: IMatches

  readonly onRenameBranch: (branchName: string) => void
  /** Specifies whether the branch is local */
  readonly isLocal: boolean

  readonly onDeleteBranch: (branchName: string) => void
}

/** The branch component. */
export class BranchListItem extends React.Component<IBranchListItemProps, {}> {
  private onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    // TODO: find out - does branch menu have "Rename..." because ... stand
    // for branch name? If so is it needed here? (same for delete)
    // Also, branch menu has & in front for not mac, what is that?
    // Should it be disabled for current branch?
    const items: ReadonlyArray<IMenuItem> = [
      {
        label: 'Rename',
        action: () => this.props.onRenameBranch(this.props.name),
      },
      {
        enabled: this.props.isLocal,
        label: 'Delete',
        action: () => this.props.onDeleteBranch(this.props.name),
      },
    ]

    showContextualMenu(items)
  }

  public render() {
    const lastCommitDate = this.props.lastCommitDate
    const isCurrentBranch = this.props.isCurrentBranch
    const name = this.props.name

    const date = lastCommitDate ? moment(lastCommitDate).fromNow() : ''
    const icon = isCurrentBranch ? OcticonSymbol.check : OcticonSymbol.gitBranch
    const infoTitle = isCurrentBranch
      ? 'Current branch'
      : lastCommitDate
      ? lastCommitDate.toString()
      : ''
    return (
      <div onContextMenu={this.onContextMenu} className="branches-list-item">
        <Octicon className="icon" symbol={icon} />
        <div className="name" title={name}>
          <HighlightText text={name} highlight={this.props.matches.title} />
        </div>
        <div className="description" title={infoTitle}>
          {date}
        </div>
      </div>
    )
  }
}
